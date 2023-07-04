import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root"
})
export class ScriptServiceService {
  private scripts: any = {
    gmaps: {
      loaded: false,
      promise: null,
      src:
        "https://maps.googleapis.com/maps/api/js?key=AIzaSyA-gch2qP_QPrkMbsIz3dRD9pNj2c-7tHM"
    },
    stripe: {
      loaded: false,
      promise: null,
      src: "https://js.stripe.com/v3/"
    },
    facebooksdk: {
      loaded: false,
      promise: null,
      src: "https://connect.facebook.net/en_US/sdk.js"
    }
  };

  constructor() {}

  // load a single or multiple scripts
  load(...scripts: string[]) {
    const promises: any[] = [];
    // push the returned promise of each loadScript call
    scripts.forEach(script => promises.push(this.loadScript(script)));
    // return promise.all that resolves when all promises are resolved
    return Promise.all(promises);
  }

  // load the script
  async loadScript(name: string) {
    if (this.scripts[name].loaded) {
      return { script: name, loaded: true, status: "Already Loaded" };
    }

    if (this.scripts[name].promise === null) {
      this.scripts[name].promise = new Promise((resolve, reject) => {
        // load script
        const script = document.createElement("script");
        script.type = "text/javascript";
        script.src = this.scripts[name].src;
        script.id = "facebook-jssdk";
        // cross browser handling of onLoaded event
        if ((script as any).readyState) {
          // IE
          (script as any).onreadystatechange = () => {
            if (
              (script as any).readyState === "loaded" ||
              (script as any).readyState === "complete"
            ) {
              (script as any).onreadystatechange = null;
              this.scripts[name].loaded = true;
              resolve({ script: name, loaded: true, status: "Loaded" });
            }
          };
        } else {
          // Others
          script.onload = () => {
            this.scripts[name].loaded = true;
            resolve({ script: name, loaded: true, status: "Loaded" });
          };
        }
        script.onerror = (error: any) =>
          resolve({ script: name, loaded: false, status: "Loaded" });
        // finally append the script tag in the DOM
        document.getElementsByTagName("head")[0].appendChild(script);
      });
    }

    return this.scripts[name].promise;
  }
}
