import 'reflect-metadata'
import 'es6-shim'
import {Component, View, LifecycleEvent, bootstrap} from 'angular2/angular2'
import {
  UxRouter,
  UX_ROUTER_BINDINGS,
  UX_ROUTER_DIRECTIVES
 } from 'ux-router'

import {HomeComponent} from './home'
import {AboutComponent} from './about'

@Component({
  selector: 'demo-app',
  bindings: [],
  lifecycle: [LifecycleEvent.onInit]
})
@View({
  template: `
    <div>Demo App </div>
    <div>
     <a href="/#/">Home</a>
     <a href="/#/about">About</a>
    </div>
    <ux-view></ux-view>
  `,
  directives: [UX_ROUTER_DIRECTIVES]
})
export class DemoApp {
  constructor(public router: UxRouter){
    router.route('/',{component: HomeComponent});
    router.route('/about',{component: AboutComponent});
  }
  onInit(){
    this.router.start()
  }
}


bootstrap(DemoApp,[UX_ROUTER_BINDINGS]).catch(err => console.log(err));