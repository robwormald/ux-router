import {Component, View} from 'angular2/angular2'

@Component({
  selector: 'home-component'
})
@View({
  template: '<div>Home Component</div>'
})
export class HomeComponent {
  constructor(){
    console.log('home component init')
  }
}