'use strict';

customElements.define('compodoc-menu', class extends HTMLElement {
    constructor() {
        super();
        this.isNormalMode = this.getAttribute('mode') === 'normal';
    }

    connectedCallback() {
        this.render(this.isNormalMode);
    }

    render(isNormalMode) {
        let tp = lithtml.html(`
        <nav>
            <ul class="list">
                <li class="title">
                    <a href="index.html" data-type="index-link">dragon-drop documentation</a>
                </li>

                <li class="divider"></li>
                ${ isNormalMode ? `<div id="book-search-input" role="search"><input type="text" placeholder="Type to search"></div>` : '' }
                <li class="chapter">
                    <a data-type="chapter-link" href="index.html"><span class="icon ion-ios-home"></span>Getting started</a>
                    <ul class="links">
                        <li class="link">
                            <a href="overview.html" data-type="chapter-link">
                                <span class="icon ion-ios-keypad"></span>Overview
                            </a>
                        </li>
                        <li class="link">
                            <a href="index.html" data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>README
                            </a>
                        </li>
                                <li class="link">
                                    <a href="dependencies.html" data-type="chapter-link">
                                        <span class="icon ion-ios-list"></span>Dependencies
                                    </a>
                                </li>
                                <li class="link">
                                    <a href="properties.html" data-type="chapter-link">
                                        <span class="icon ion-ios-apps"></span>Properties
                                    </a>
                                </li>
                    </ul>
                </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#components-links"' :
                            'data-bs-target="#xs-components-links"' }>
                            <span class="icon ion-md-cog"></span>
                            <span>Components</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="components-links"' : 'id="xs-components-links"' }>
                            <li class="link">
                                <a href="components/AppComponent.html" data-type="entity-link" >AppComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ContextMenuWrapperComponent.html" data-type="entity-link" >ContextMenuWrapperComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/DefaultSidenavComponent.html" data-type="entity-link" >DefaultSidenavComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/DesignCanvasComponent.html" data-type="entity-link" >DesignCanvasComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/EditorComponent.html" data-type="entity-link" >EditorComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ElementContextMenuComponent.html" data-type="entity-link" >ElementContextMenuComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/FooterComponent.html" data-type="entity-link" >FooterComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/GlobalSettingsSidenavComponent.html" data-type="entity-link" >GlobalSettingsSidenavComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/HeaderComponent.html" data-type="entity-link" >HeaderComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/HomeComponent.html" data-type="entity-link" >HomeComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/NotFoundComponent.html" data-type="entity-link" >NotFoundComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/PagesSidenavComponent.html" data-type="entity-link" >PagesSidenavComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ResizableDraggableComponent.html" data-type="entity-link" >ResizableDraggableComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/RichTextEditorComponent.html" data-type="entity-link" >RichTextEditorComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/SectionComponent.html" data-type="entity-link" >SectionComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/SectionContextMenuComponent.html" data-type="entity-link" >SectionContextMenuComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/SectionsSidenavComponent.html" data-type="entity-link" >SectionsSidenavComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/SidenavWrapperComponent.html" data-type="entity-link" >SidenavWrapperComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/SpinnerComponent.html" data-type="entity-link" >SpinnerComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ThemeColorsPickerComponent.html" data-type="entity-link" >ThemeColorsPickerComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ThemeFontsSelectComponent.html" data-type="entity-link" >ThemeFontsSelectComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ThemeSettingsSidenavComponent.html" data-type="entity-link" >ThemeSettingsSidenavComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ToolbarComponent.html" data-type="entity-link" >ToolbarComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/WebsiteSettingsComponent.html" data-type="entity-link" >WebsiteSettingsComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/WebsiteSettingsDialogComponent.html" data-type="entity-link" >WebsiteSettingsDialogComponent</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#directives-links"' :
                                'data-bs-target="#xs-directives-links"' }>
                                <span class="icon ion-md-code-working"></span>
                                <span>Directives</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="directives-links"' : 'id="xs-directives-links"' }>
                                <li class="link">
                                    <a href="directives/DragCursorDirective.html" data-type="entity-link" >DragCursorDirective</a>
                                </li>
                                <li class="link">
                                    <a href="directives/DynamicContentAreaDirective.html" data-type="entity-link" >DynamicContentAreaDirective</a>
                                </li>
                                <li class="link">
                                    <a href="directives/ExcludeFromExportDirective.html" data-type="entity-link" >ExcludeFromExportDirective</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#classes-links"' :
                            'data-bs-target="#xs-classes-links"' }>
                            <span class="icon ion-ios-paper"></span>
                            <span>Classes</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="classes-links"' : 'id="xs-classes-links"' }>
                            <li class="link">
                                <a href="classes/ElementClassObserver.html" data-type="entity-link" >ElementClassObserver</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#injectables-links"' :
                                'data-bs-target="#xs-injectables-links"' }>
                                <span class="icon ion-md-arrow-round-down"></span>
                                <span>Injectables</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="injectables-links"' : 'id="xs-injectables-links"' }>
                                <li class="link">
                                    <a href="injectables/CustomTitleStrategy.html" data-type="entity-link" >CustomTitleStrategy</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/DesignCanvasEffects.html" data-type="entity-link" >DesignCanvasEffects</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/EditorEffects.html" data-type="entity-link" >EditorEffects</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ExportWebsiteService.html" data-type="entity-link" >ExportWebsiteService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/GlobalSettingsEffects.html" data-type="entity-link" >GlobalSettingsEffects</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/GoogleFontsService.html" data-type="entity-link" >GoogleFontsService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/OverlayService.html" data-type="entity-link" >OverlayService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/SectionsService.html" data-type="entity-link" >SectionsService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/SidenavService.html" data-type="entity-link" >SidenavService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ThemeSettingsEffects.html" data-type="entity-link" >ThemeSettingsEffects</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/UtilsService.html" data-type="entity-link" >UtilsService</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#interfaces-links"' :
                            'data-bs-target="#xs-interfaces-links"' }>
                            <span class="icon ion-md-information-circle-outline"></span>
                            <span>Interfaces</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? ' id="interfaces-links"' : 'id="xs-interfaces-links"' }>
                            <li class="link">
                                <a href="interfaces/AppState.html" data-type="entity-link" >AppState</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/CanDeactivateComponent.html" data-type="entity-link" >CanDeactivateComponent</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/DesignCanvasState.html" data-type="entity-link" >DesignCanvasState</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/DragonDropState.html" data-type="entity-link" >DragonDropState</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/DynamicComponent.html" data-type="entity-link" >DynamicComponent</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/DynamicComponentType.html" data-type="entity-link" >DynamicComponentType</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/DynamicElement.html" data-type="entity-link" >DynamicElement</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/EditorState.html" data-type="entity-link" >EditorState</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/GlobalSettingsState.html" data-type="entity-link" >GlobalSettingsState</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ListItem.html" data-type="entity-link" >ListItem</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Page.html" data-type="entity-link" >Page</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/PageInput.html" data-type="entity-link" >PageInput</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/SectionCard.html" data-type="entity-link" >SectionCard</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/SectionItem.html" data-type="entity-link" >SectionItem</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Sidenav.html" data-type="entity-link" >Sidenav</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ThemeSettingsState.html" data-type="entity-link" >ThemeSettingsState</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/WebFontItem.html" data-type="entity-link" >WebFontItem</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/WebFontListResponse.html" data-type="entity-link" >WebFontListResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Website.html" data-type="entity-link" >Website</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/WebsiteInput.html" data-type="entity-link" >WebsiteInput</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#miscellaneous-links"'
                            : 'data-bs-target="#xs-miscellaneous-links"' }>
                            <span class="icon ion-ios-cube"></span>
                            <span>Miscellaneous</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"' }>
                            <li class="link">
                                <a href="miscellaneous/enumerations.html" data-type="entity-link">Enums</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/functions.html" data-type="entity-link">Functions</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/typealiases.html" data-type="entity-link">Type aliases</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/variables.html" data-type="entity-link">Variables</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <a data-type="chapter-link" href="coverage.html"><span class="icon ion-ios-stats"></span>Documentation coverage</a>
                    </li>
                    <li class="divider"></li>
                    <li class="copyright">
                        Documentation generated using <a href="https://compodoc.app/" target="_blank" rel="noopener noreferrer">
                            <img data-src="images/compodoc-vectorise.png" class="img-responsive" data-type="compodoc-logo">
                        </a>
                    </li>
            </ul>
        </nav>
        `);
        this.innerHTML = tp.strings;
    }
});