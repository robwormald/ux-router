import {
  Component,
  View,
  ElementRef,
  DynamicComponentLoader,
  Attribute,
  EventEmitter,
  Injectable
} from 'angular2/angular2'

import RouteRecognizer from 'route-recognizer'

import {Observable, Subject} from 'rx'

@Injectable()
class HashChangeListener {
  changes: Observable<T>;
  constructor(){
    this.changes = Observable.fromEvent(window, 'hashchange')
      .map(event => event.newURL);
  }
}

@Injectable()
class UxViewRegistry {
  private _views: Object;
  constructor(){
    this._views = {}
  }
  getView(name){
    console.log(name)
    return this._views[name];
  }
  addView(name, view){
    this._views[name] = view
  }
}

@Injectable()
export class UxRouter {
  _inputs: Subject;
  constructor(
    private registry: UxViewRegistry,
    private listener: HashChangeListener,
    private routeRecognizer: RouteRecognizer){
    this._inputs = new Subject();
  }
  
  go(name, params){
    this._inputs.onNext({name, params});
  }
  
  route(path, handler){
    this.routeRecognizer.add([{path: path, handler: handler}]);
  }
  
  start(startPath?:string){
    this.listener.changes
      .startWith(startPath || window.location.href)
      .map(url => url.split('#'))
      .map(([root,path]) => path)
      .map(path => this.matchPath(path))
      .subscribe(handler => this.loadComponent(handler))
  }
  
  loadComponent(route){
    if(route){
      //todo : nested routes
      let [segment] = route;
      let outlet = this.registry.getView(segment.view || '__default');
      outlet.showComponent(segment.handler.component);
    }
  }
  
  matchPath(path:string){
    return this.routeRecognizer.recognize(path);
  }
  
  registerOutlet(view:UxView, name?:string){
    this.registry.addView(name || '__default', view);
  }
}

const VIEW_SELECTOR = 'ux-view'

@Component({
  selector: VIEW_SELECTOR
})
@View({
  template: '<div></div>'
})
export class UxView {
  constructor(
    private router: UxRouter,
    private elementRef:ElementRef,
    private loader:DynamicComponentLoader,
    @Attribute('name') viewName){
      router.registerOutlet(this, viewName);      
  }
  
  showComponent(component){
    this.loader.loadAsRoot(component, VIEW_SELECTOR);
  }
}

export const UX_ROUTER_BINDINGS = [
  DynamicComponentLoader,
  RouteRecognizer,
  HashChangeListener,
  UxViewRegistry,
  UxRouter];
export const UX_ROUTER_DIRECTIVES = [UxView]