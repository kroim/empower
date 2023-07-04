// Protractor configuration file, see link for more information
// https://github.com/angular/protractor/blob/master/lib/config.ts

const { SpecReporter } = require('jasmine-spec-reporter');

exports.config = {

  rootElement:'*',
  allScriptsTimeout: 11000000000,
  specs: [
    './src/**/*.e2e-spec.ts'
  ],
  capabilities: {
    'browserName': 'chrome',
    'chromeOptions': {
      args: ["--disable-gpu", "window-size=1920, 1080",'--disable-browser-side-navigation'] //"--headless"
    }   
  },
  directConnect: true,
  baseUrl: 'http://localhost:4200/',
  framework: 'jasmine',
  jasmineNodeOpts: {
    showColors: true,
    defaultTimeoutInterval: 1100000000,
    print: function() {}
  },  

  params: {
      mailListener : null
  },
  onPrepare() {
    var emailDate = (new Date().getTime());
    var MailListener = require("mail-listener2");
    // here goes your email connection configuration
    var mailListener = new MailListener({
        username: "formreportautomation@gmail.com",
        password: "Test@213",
        host: "imap.gmail.com",
        port: 993, // imap port 
        tls: true,
        fetchUnreadOnStart: false // use it only if you want to get all unread email on lib start. Default is `false`, 
    });

    mailListener.start();

    mailListener.on("server:connected", function(){
        console.log("Mail listener initialized");
    });

    global.mailListener = mailListener;

    require('ts-node').register({
      project: require('path').join(__dirname, './tsconfig.e2e.json')
    });
    jasmine.getEnv().addReporter(new SpecReporter({ spec: { displayStacktrace: true } }));


  },

  onCleanUp: function () {
      mailListener.stop();
  }
};