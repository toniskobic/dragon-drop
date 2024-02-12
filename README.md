# Dragon Drop - A Static Website Builder

<p align="center">
  <img width="500px" src="https://github.com/toniskobic/dragon-drop/blob/main/src/assets/svgs/dragon-drop-short.svg" alt="Dragon Drop">
</p>

Dragon Drop is an Angular static website builder app inspired by popular website builders such as Wix, Squarespace, and Shopify. Users can add, arrange, and customize webpage sections and elements using drag-and-drop and resizing functionalities. Upon completion, the application generates a static website ready for deployment.

Production deployed builder: [Dragon Drop Website Builder](https://dragon-drop-five.vercel.app/)

Example website generated using Dragon Drop Website Builder: [Website](https://toniskobic.github.io/dragon-drop-generated-website/pages/)

Example website repo: [Repo](https://github.com/toniskobic/dragon-drop-generated-website)

Documentation generated with Compodoc: [Documentation](https://toniskobic.github.io/dragon-drop/index.html)

This app was made as part of the graduate thesis (T. Škobić, "Building Web site generators", Graduate thesis, University of Zagreb, Faculty of Organization and Informatics, Varaždin, 2023, Available at: [https://urn.nsk.hr/urn:nbn:hr:211:816572](https://urn.nsk.hr/urn:nbn:hr:211:816572)).

## Features

- **Drag-and-Drop Sections**: Easily add new sections to your webpage.
- **Section Organization**: Arrange and organize sections and elements via drag-and-drop.
- **Resizable Elements**: Adjust the size of sections and elements.
- **Context Menus**: Specialized context menus for sections and elements.
- **Styling**: Apply global styles or customized styles for individual sections and elements.
- **Undo/Redo**: Ability to revert or reapply changes.
- **Preview**: View your website design for both desktop and mobile screens.
- **Predefined Sections**: Special footer and header sections with link lists.

## Framweworks and libraries used

- Angular Material
- Angular CDK
- CKEditor 5
- NgRx
- ngrx-wieder
- angular-gridster2
- angular-resizable-element
- jszip
- file-saver
- lodash-es
- ngx-color-picker
- uuid
- RxJS

## Development

This project was generated with Angular CLI version 16.1.4.

### Development Server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

### Code Scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

### Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

### Further Help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
