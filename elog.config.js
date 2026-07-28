module.exports = {
  write: {
    platform: 'wolai',
    wolai: {
      token: process.env.WOLAI_TOKEN,
      catalogId: process.env.WOLAI_CATALOG_ID,
    },
  },
  deploy: {
    platform: 'local',
    local: {
      outputDir: 'content/blog',
      filename: 'title',
      format: 'markdown',
    },
  },
  image: {
    enable: false,
  },
};
