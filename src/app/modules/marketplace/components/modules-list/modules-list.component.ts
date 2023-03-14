import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-modules-list',
  templateUrl: './modules-list.component.html',
  styleUrls: ['./modules-list.component.scss']
})
export class ModulesListComponent implements OnInit {

  constructor(private fb: FormBuilder) {}
 
  searchFormGroup!: FormGroup;

  modules = [
    {
      title: "This is a test title",
      subtitle: "This a test subtitle",
      shortDescription: "Lorem ipsum dolor sit search, consectetur adipiscing elit. Integer sollicitudin ipsum nunc, eu consectetur risus sagittis id. Donec dictum a orci at ornare. Nulla ac nisl augue. Donec elementum porta congue. Fusce mattis nibh dapibus, congue massa id, hendrerit arcu. Pellentesque dapibus placerat erat, et tristique ex semper interdum. Sed vitae urna non nisi hendrerit rhoncus. Sed ultricies urna sit amet orci egestas, sit amet tincidunt turpis iaculis. Nullam accumsan commodo ipsum lobortis dapibus. Sed cursus tristique tellus, non sodales velit vestibulum vel. Ut vitae convallis libero, non faucibus sapien. Morbi dolor ligula, feugiat eu pretium at, dapibus id felis. Donec sed efficitur ipsum. Ut condimentum pellentesque venenatis. Donec et sollicitudin lorem, lacinia laoreet lorem."
    },
    {
      title: "This is a test title",
      subtitle: "This a test subtitle",
      shortDescription: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer sollicitudin ipsum nunc, eu consectetur risus sagittis id. Donec dictum a orci at ornare. Nulla ac nisl augue. Donec elementum porta congue. Fusce mattis nibh dapibus, congue massa id, hendrerit arcu. Pellentesque dapibus placerat erat, et tristique ex semper interdum. Sed vitae urna non nisi hendrerit rhoncus. Sed ultricies urna sit amet orci egestas, sit amet tincidunt turpis iaculis. Nullam accumsan commodo ipsum lobortis dapibus. Sed cursus tristique tellus, non sodales velit vestibulum vel. Ut vitae convallis libero, non faucibus sapien. Morbi dolor ligula, feugiat eu pretium at, dapibus id felis. Donec sed efficitur ipsum. Ut condimentum pellentesque venenatis. Donec et sollicitudin lorem, lacinia laoreet lorem."
    },
    {
      title: "This is a test title",
      subtitle: "This a test subtitle",
      shortDescription: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer sollicitudin ipsum nunc, eu consectetur risus sagittis id. Donec dictum a orci at ornare. Nulla ac nisl augue. Donec elementum porta congue. Fusce mattis nibh dapibus, congue massa id, hendrerit arcu. Pellentesque dapibus placerat erat, et tristique ex semper interdum. Sed vitae urna non nisi hendrerit rhoncus. Sed ultricies urna sit amet orci egestas, sit amet tincidunt turpis iaculis. Nullam accumsan commodo ipsum lobortis dapibus. Sed cursus tristique tellus, non sodales velit vestibulum vel. Ut vitae convallis libero, non faucibus sapien. Morbi dolor ligula, feugiat eu pretium at, dapibus id felis. Donec sed efficitur ipsum. Ut condimentum pellentesque venenatis. Donec et sollicitudin lorem, lacinia laoreet lorem."
    },
    {
      title: "This is a test title",
      subtitle: "This a test subtitle for search",
      shortDescription: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer sollicitudin ipsum nunc, eu consectetur risus sagittis id. Donec dictum a orci at ornare. Nulla ac nisl augue. Donec elementum porta congue. Fusce mattis nibh dapibus, congue massa id, hendrerit arcu. Pellentesque dapibus placerat erat, et tristique ex semper interdum. Sed vitae urna non nisi hendrerit rhoncus. Sed ultricies urna sit amet orci egestas, sit amet tincidunt turpis iaculis. Nullam accumsan commodo ipsum lobortis dapibus. Sed cursus tristique tellus, non sodales velit vestibulum vel. Ut vitae convallis libero, non faucibus sapien. Morbi dolor ligula, feugiat eu pretium at, dapibus id felis. Donec sed efficitur ipsum. Ut condimentum pellentesque venenatis. Donec et sollicitudin lorem, lacinia laoreet lorem."
    },
    {
      title: "This is a test title",
      subtitle: "This a test subtitle",
      shortDescription: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer sollicitudin ipsum nunc, eu consectetur risus sagittis id. Donec dictum a orci at ornare. Nulla ac nisl augue. Donec elementum porta congue. Fusce mattis nibh dapibus, congue massa id, hendrerit arcu. Pellentesque dapibus placerat erat, et tristique ex semper interdum. Sed vitae urna non nisi hendrerit rhoncus. Sed ultricies urna sit amet orci egestas, sit amet tincidunt turpis iaculis. Nullam accumsan commodo ipsum lobortis dapibus. Sed cursus tristique tellus, non sodales velit vestibulum vel. Ut vitae convallis libero, non faucibus sapien. Morbi dolor ligula, feugiat eu pretium at, dapibus id felis. Donec sed efficitur ipsum. Ut condimentum pellentesque venenatis. Donec et sollicitudin lorem, lacinia laoreet lorem."
    },
    {
      title: "This is a test title",
      subtitle: "This a test subtitle",
      shortDescription: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer sollicitudin ipsum nunc, eu consectetur risus sagittis id. Donec dictum a orci at ornare. Nulla ac nisl augue. Donec elementum porta congue. Fusce mattis nibh dapibus, congue massa id, hendrerit arcu. Pellentesque dapibus placerat erat, et tristique ex semper interdum. Sed vitae urna non nisi hendrerit rhoncus. Sed ultricies urna sit amet orci egestas, sit amet tincidunt turpis iaculis. Nullam accumsan commodo ipsum lobortis dapibus. Sed cursus tristique tellus, non sodales velit vestibulum vel. Ut vitae convallis libero, non faucibus sapien. Morbi dolor ligula, feugiat eu pretium at, dapibus id felis. Donec sed efficitur ipsum. Ut condimentum pellentesque venenatis. Donec et sollicitudin lorem, lacinia laoreet lorem."
    },
    {
      title: "This is a test title",
      subtitle: "This a test subtitle",
      shortDescription: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer sollicitudin ipsum nunc, eu consectetur risus sagittis id. Donec dictum a orci at ornare. Nulla ac nisl augue. Donec elementum porta congue. Fusce mattis nibh dapibus, congue massa id, hendrerit arcu. Pellentesque dapibus placerat erat, et tristique ex semper interdum. Sed vitae urna non nisi hendrerit rhoncus. Sed ultricies urna sit amet orci egestas, sit amet tincidunt turpis iaculis. Nullam accumsan commodo ipsum lobortis dapibus. Sed cursus tristique tellus, non sodales velit vestibulum vel. Ut vitae convallis libero, non faucibus sapien. Morbi dolor ligula, feugiat eu pretium at, dapibus id felis. Donec sed efficitur ipsum. Ut condimentum pellentesque venenatis. Donec et sollicitudin lorem, lacinia laoreet lorem."
    },
    {
      title: "This is a test title for search",
      subtitle: "This a test subtitle",
      shortDescription: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer sollicitudin ipsum nunc, eu consectetur risus sagittis id. Donec dictum a orci at ornare. Nulla ac nisl augue. Donec elementum porta congue. Fusce mattis nibh dapibus, congue massa id, hendrerit arcu. Pellentesque dapibus placerat erat, et tristique ex semper interdum. Sed vitae urna non nisi hendrerit rhoncus. Sed ultricies urna sit amet orci egestas, sit amet tincidunt turpis iaculis. Nullam accumsan commodo ipsum lobortis dapibus. Sed cursus tristique tellus, non sodales velit vestibulum vel. Ut vitae convallis libero, non faucibus sapien. Morbi dolor ligula, feugiat eu pretium at, dapibus id felis. Donec sed efficitur ipsum. Ut condimentum pellentesque venenatis. Donec et sollicitudin lorem, lacinia laoreet lorem."
    },
  ]

  initializeForm(){
    this.searchFormGroup = this.fb.group({
      search: ''
    })
  }

  ngOnInit(): void {
    this.initializeForm();
  }


}
