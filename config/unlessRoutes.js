module.exports = {
    authenticateRoutes: {
      path: [
        {url:"/add-user", method:"POST"},
        {url:"/login", method:"POST"},
        { url: /^\/add-attendance\/.*/, method: 'POST' },
        { url: /^\/add-checkout\/.*/, method: 'POST' },
        {url:"/get-attendance", method:"GET"},
        {url:"/search-attendance", method:"GET"}
      ],
    },
  };