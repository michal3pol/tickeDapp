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
                    <a href="index.html" data-type="index-link">ticke-dapp documentation</a>
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
                    <li class="chapter modules">
                        <a data-type="chapter-link" href="modules.html">
                            <div class="menu-toggler linked" data-toggle="collapse" ${ isNormalMode ?
                                'data-target="#modules-links"' : 'data-target="#xs-modules-links"' }>
                                <span class="icon ion-ios-archive"></span>
                                <span class="link-name">Modules</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                        </a>
                        <ul class="links collapse " ${ isNormalMode ? 'id="modules-links"' : 'id="xs-modules-links"' }>
                            <li class="link">
                                <a href="modules/AppModule.html" data-type="entity-link" >AppModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-AppModule-2119912d9fce2e36a76c20c07e25602e1f70583cf9a9a061ef367497cda35daf5815dc64bf304fbe522419967f77b164280b28c5f21dcd93b2e043bf162031f1"' : 'data-target="#xs-components-links-module-AppModule-2119912d9fce2e36a76c20c07e25602e1f70583cf9a9a061ef367497cda35daf5815dc64bf304fbe522419967f77b164280b28c5f21dcd93b2e043bf162031f1"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-AppModule-2119912d9fce2e36a76c20c07e25602e1f70583cf9a9a061ef367497cda35daf5815dc64bf304fbe522419967f77b164280b28c5f21dcd93b2e043bf162031f1"' :
                                            'id="xs-components-links-module-AppModule-2119912d9fce2e36a76c20c07e25602e1f70583cf9a9a061ef367497cda35daf5815dc64bf304fbe522419967f77b164280b28c5f21dcd93b2e043bf162031f1"' }>
                                            <li class="link">
                                                <a href="components/AppComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AppComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/FooterComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >FooterComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/NavigationBarComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >NavigationBarComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/PageNotFoundComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PageNotFoundComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-AppModule-2119912d9fce2e36a76c20c07e25602e1f70583cf9a9a061ef367497cda35daf5815dc64bf304fbe522419967f77b164280b28c5f21dcd93b2e043bf162031f1"' : 'data-target="#xs-injectables-links-module-AppModule-2119912d9fce2e36a76c20c07e25602e1f70583cf9a9a061ef367497cda35daf5815dc64bf304fbe522419967f77b164280b28c5f21dcd93b2e043bf162031f1"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-AppModule-2119912d9fce2e36a76c20c07e25602e1f70583cf9a9a061ef367497cda35daf5815dc64bf304fbe522419967f77b164280b28c5f21dcd93b2e043bf162031f1"' :
                                        'id="xs-injectables-links-module-AppModule-2119912d9fce2e36a76c20c07e25602e1f70583cf9a9a061ef367497cda35daf5815dc64bf304fbe522419967f77b164280b28c5f21dcd93b2e043bf162031f1"' }>
                                        <li class="link">
                                            <a href="injectables/WalletService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >WalletService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/AppRoutingModule.html" data-type="entity-link" >AppRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/ConcertManagementModule.html" data-type="entity-link" >ConcertManagementModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-ConcertManagementModule-66400bb1d939db2f9f7aefe3f3f26b330b98408487e6e4ae2b5badd46ffc6566a5ce436a6e65bfa79953b2925171be3fa7368d72ede19e207638eec2e7190a48"' : 'data-target="#xs-components-links-module-ConcertManagementModule-66400bb1d939db2f9f7aefe3f3f26b330b98408487e6e4ae2b5badd46ffc6566a5ce436a6e65bfa79953b2925171be3fa7368d72ede19e207638eec2e7190a48"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-ConcertManagementModule-66400bb1d939db2f9f7aefe3f3f26b330b98408487e6e4ae2b5badd46ffc6566a5ce436a6e65bfa79953b2925171be3fa7368d72ede19e207638eec2e7190a48"' :
                                            'id="xs-components-links-module-ConcertManagementModule-66400bb1d939db2f9f7aefe3f3f26b330b98408487e6e4ae2b5badd46ffc6566a5ce436a6e65bfa79953b2925171be3fa7368d72ede19e207638eec2e7190a48"' }>
                                            <li class="link">
                                                <a href="components/CreateConcertComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CreateConcertComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/MyConcertsComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >MyConcertsComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/SectorComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SectorComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/WhitelistComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >WhitelistComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/MarketplaceModule.html" data-type="entity-link" >MarketplaceModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-MarketplaceModule-62beea20e71ca18efa9059f7514ce81d9f95f135c3e2467e6c5d0bb27ca7274e0c919d110bb2a20dafcd2e5f3312b1d8704914713572c1697696466fc3757e70"' : 'data-target="#xs-components-links-module-MarketplaceModule-62beea20e71ca18efa9059f7514ce81d9f95f135c3e2467e6c5d0bb27ca7274e0c919d110bb2a20dafcd2e5f3312b1d8704914713572c1697696466fc3757e70"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-MarketplaceModule-62beea20e71ca18efa9059f7514ce81d9f95f135c3e2467e6c5d0bb27ca7274e0c919d110bb2a20dafcd2e5f3312b1d8704914713572c1697696466fc3757e70"' :
                                            'id="xs-components-links-module-MarketplaceModule-62beea20e71ca18efa9059f7514ce81d9f95f135c3e2467e6c5d0bb27ca7274e0c919d110bb2a20dafcd2e5f3312b1d8704914713572c1697696466fc3757e70"' }>
                                            <li class="link">
                                                <a href="components/AudienceLayoutComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AudienceLayoutComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ConcertSectorsComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ConcertSectorsComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ConcertSellComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ConcertSellComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/MarketplaceComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >MarketplaceComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ReselledTicketComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ReselledTicketComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/StandardTicketComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >StandardTicketComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/PipesModule.html" data-type="entity-link" >PipesModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#pipes-links-module-PipesModule-be97499bc27ecb7a5d5f47bdf3bb1319ec1eb14c4289dbab6c1643cc3b6e708d259a714d1a9edeb8e9feec4b5125bd84cb2781b245cb82deab5eeb3bb5f69065"' : 'data-target="#xs-pipes-links-module-PipesModule-be97499bc27ecb7a5d5f47bdf3bb1319ec1eb14c4289dbab6c1643cc3b6e708d259a714d1a9edeb8e9feec4b5125bd84cb2781b245cb82deab5eeb3bb5f69065"' }>
                                            <span class="icon ion-md-add"></span>
                                            <span>Pipes</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="pipes-links-module-PipesModule-be97499bc27ecb7a5d5f47bdf3bb1319ec1eb14c4289dbab6c1643cc3b6e708d259a714d1a9edeb8e9feec4b5125bd84cb2781b245cb82deab5eeb3bb5f69065"' :
                                            'id="xs-pipes-links-module-PipesModule-be97499bc27ecb7a5d5f47bdf3bb1319ec1eb14c4289dbab6c1643cc3b6e708d259a714d1a9edeb8e9feec4b5125bd84cb2781b245cb82deab5eeb3bb5f69065"' }>
                                            <li class="link">
                                                <a href="pipes/FilterConcertsPipe.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >FilterConcertsPipe</a>
                                            </li>
                                            <li class="link">
                                                <a href="pipes/WeiToEthPipe.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >WeiToEthPipe</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/UserModule.html" data-type="entity-link" >UserModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-UserModule-4d887f627412515cf626c065c0fed5013e8d48195da812a51f3761b20582144f12e3ad61579fb35db84b95ade9215853d5dd1a5983c82ebac27611fff3bb4d37"' : 'data-target="#xs-components-links-module-UserModule-4d887f627412515cf626c065c0fed5013e8d48195da812a51f3761b20582144f12e3ad61579fb35db84b95ade9215853d5dd1a5983c82ebac27611fff3bb4d37"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-UserModule-4d887f627412515cf626c065c0fed5013e8d48195da812a51f3761b20582144f12e3ad61579fb35db84b95ade9215853d5dd1a5983c82ebac27611fff3bb4d37"' :
                                            'id="xs-components-links-module-UserModule-4d887f627412515cf626c065c0fed5013e8d48195da812a51f3761b20582144f12e3ad61579fb35db84b95ade9215853d5dd1a5983c82ebac27611fff3bb4d37"' }>
                                            <li class="link">
                                                <a href="components/CreateOfferDialogComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CreateOfferDialogComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/MyNftComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >MyNftComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/MyOffersComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >MyOffersComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                </ul>
                </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#classes-links"' :
                            'data-target="#xs-classes-links"' }>
                            <span class="icon ion-ios-paper"></span>
                            <span>Classes</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="classes-links"' : 'id="xs-classes-links"' }>
                            <li class="link">
                                <a href="classes/EtherUnitConverter.html" data-type="entity-link" >EtherUnitConverter</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#injectables-links"' :
                                'data-target="#xs-injectables-links"' }>
                                <span class="icon ion-md-arrow-round-down"></span>
                                <span>Injectables</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="injectables-links"' : 'id="xs-injectables-links"' }>
                                <li class="link">
                                    <a href="injectables/AlchemyApiService.html" data-type="entity-link" >AlchemyApiService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/NftMarketplaceService.html" data-type="entity-link" >NftMarketplaceService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/SnackbarService.html" data-type="entity-link" >SnackbarService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/Ticked1155Service.html" data-type="entity-link" >Ticked1155Service</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/TickedFactoryService.html" data-type="entity-link" >TickedFactoryService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/WalletService.html" data-type="entity-link" >WalletService</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#guards-links"' :
                            'data-target="#xs-guards-links"' }>
                            <span class="icon ion-ios-lock"></span>
                            <span>Guards</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="guards-links"' : 'id="xs-guards-links"' }>
                            <li class="link">
                                <a href="guards/AuthOrganizatorGuard.html" data-type="entity-link" >AuthOrganizatorGuard</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#interfaces-links"' :
                            'data-target="#xs-interfaces-links"' }>
                            <span class="icon ion-md-information-circle-outline"></span>
                            <span>Interfaces</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? ' id="interfaces-links"' : 'id="xs-interfaces-links"' }>
                            <li class="link">
                                <a href="interfaces/Attribute.html" data-type="entity-link" >Attribute</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/AudienceDialogData.html" data-type="entity-link" >AudienceDialogData</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Contract.html" data-type="entity-link" >Contract</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/CreateOfferDialogData.html" data-type="entity-link" >CreateOfferDialogData</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/DepConcert.html" data-type="entity-link" >DepConcert</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Id.html" data-type="entity-link" >Id</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ListedTicket.html" data-type="entity-link" >ListedTicket</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Listing.html" data-type="entity-link" >Listing</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Metadata.html" data-type="entity-link" >Metadata</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/NFT.html" data-type="entity-link" >NFT</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/OwnedNFTs.html" data-type="entity-link" >OwnedNFTs</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Sector.html" data-type="entity-link" >Sector</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/SellerOffer.html" data-type="entity-link" >SellerOffer</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Ticket.html" data-type="entity-link" >Ticket</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/TokenMetadata.html" data-type="entity-link" >TokenMetadata</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/TokenUri.html" data-type="entity-link" >TokenUri</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#miscellaneous-links"'
                            : 'data-target="#xs-miscellaneous-links"' }>
                            <span class="icon ion-ios-cube"></span>
                            <span>Miscellaneous</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"' }>
                            <li class="link">
                                <a href="miscellaneous/variables.html" data-type="entity-link">Variables</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <a data-type="chapter-link" href="routes.html"><span class="icon ion-ios-git-branch"></span>Routes</a>
                        </li>
                    <li class="chapter">
                        <a data-type="chapter-link" href="coverage.html"><span class="icon ion-ios-stats"></span>Documentation coverage</a>
                    </li>
                    <li class="divider"></li>
                    <li class="copyright">
                        Documentation generated using <a href="https://compodoc.app/" target="_blank">
                            <img data-src="images/compodoc-vectorise.png" class="img-responsive" data-type="compodoc-logo">
                        </a>
                    </li>
            </ul>
        </nav>
        `);
        this.innerHTML = tp.strings;
    }
});