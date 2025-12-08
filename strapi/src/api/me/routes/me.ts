export default {
  routes: [
    {
     method: 'GET',
     path: '/me/tokens/summary',
     handler: 'me.tokensSummary',
     config: {
       policies: [],
       middlewares: [],
     },
    },
  ],
};
