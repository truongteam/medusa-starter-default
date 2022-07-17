const dotenv = require('dotenv')

let ENV_FILE_NAME = '';
switch (process.env.NODE_ENV) {
	case 'production':
		ENV_FILE_NAME = '.env.production';
		break;
	case 'staging':
		ENV_FILE_NAME = '.env.staging';
		break;
	case 'test':
		ENV_FILE_NAME = '.env.test';
		break;
	case 'development':
	default:
		ENV_FILE_NAME = '.env';
		break;
}

try {
	dotenv.config({ path: process.cwd() + '/' + ENV_FILE_NAME });
} catch (e) {
}

// CORS when consuming Medusa from admin
const ADMIN_CORS = "https://hipc-admin.vercel.app,http://localhost:7000";

// CORS to avoid issues when consuming Medusa from a client
const STORE_CORS = process.env.STORE_CORS || "https://hipc-storefront.vercel.app,http://localhost:8000";

// Database URL (here we use a local database called medusa-development)
const DATABASE_URL =
  process.env.DATABASE_URL || "postgres://localhost/medusa-store";

// Medusa uses Redis, so this needs configuration as well
const REDIS_URL = process.env.REDIS_URL || "redis://localhost:6379";

// Stripe keys
const STRIPE_API_KEY = process.env.STRIPE_API_KEY || "";
const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET || "";

// This is the place to include plugins. See API documentation for a thorough guide on plugins.
const plugins = [
  `medusa-fulfillment-manual`,
  `medusa-payment-manual`,
  {
    resolve: `medusa-payment-paypal`,
    options: {
      sandbox: process.env.PAYPAL_SANDBOX,
      client_id: process.env.PAYPAL_CLIENT_ID,
      client_secret: process.env.PAYPAL_CLIENT_SECRET,
      auth_webhook_id: process.env.PAYPAL_AUTH_WEBHOOK_ID
    }
  },
  {
    resolve: `medusa-plugin-meilisearch`,
    options: {
      // config object passed when creating an instance of the MeiliSearch client
      config: {
        host: "https://test-landlord-search.onrender.com",
        apiKey: process.env.MEILISEARCH_API_KEY || "Dung123",
      },
      settings: {
        // index name
        products: {
          // MeiliSearch's setting options to be set on a particular index
          searchableAttributes: ["title", "description", "variant_sku"],
          displayedAttributes: ["title", "description", "variant_sku"],
        },
      },
    },
  },
  {
    resolve: `medusa-file-cloudinary`,
    options: {
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
        secure: true,
    },
  },
  {
    resolve: `medusa-plugin-segment`,
    options: {
      write_key: process.env.SEGMENT_WRITE_KEY,
    }
}
  // Uncomment to add Stripe support.
  // You can create a Stripe account via: https://stripe.com
  // {
  //   resolve: `medusa-payment-stripe`,
  //   options: {
  //     api_key: STRIPE_API_KEY,
  //     webhook_secret: STRIPE_WEBHOOK_SECRET,
  //   },
  // },
];

module.exports = {
  monitoring: {
    uriPath: '/monitoring',
    authentication: true,
    onAuthenticate: function(req,username,password){
      // simple check for username and password
      return((username==='swagger-stats') 
          && (password==='swagger-stats'));
    }
  },
  projectConfig: {
    redis_url: REDIS_URL,
    // For more production-like environment install PostgresQL
    database_url: DATABASE_URL,
    database_type: "postgres",
    // database_database: "./medusa-db.sql",
    // database_type: "sqlite",
    jwt_secret: "Dung123#",
    store_cors: STORE_CORS,
    admin_cors: ADMIN_CORS,
    cookie_secret: 'Dung123#'
  },
  plugins,
};
