/**
 * site router
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreRouter('api::site.site',{
    config:{
        find:{
            middlewares:["global::is-tenant-owner"]
        },
        findOne: {
            middlewares:["global::is-site-owner"]
        },
        create: {
            middlewares:["global::is-site-owner"]
        },
        update: {
            middlewares:["global::is-site-owner"]
        },
        delete: {
            middlewares:["global::is-site-owner"]
        }
    },
    
});
