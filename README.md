[<p align="center"><img src="https://github.com/numherit-dev/pmp/blob/main/src/assets/img/num.webp" alt="logo numherit" width="200"/></p>](#)

[<p align="center"><h1 style="color:#e2590f">WELCOME TO PHCO</h1></p>](#)

1. ## _Structure du projet_

```
PHCO V2
├── CHANGELOG.md
├── LICENSE.md
├── README.md
├── angular-cli.json
├── documentation
├── e2e
├── karma.conf.js
├── package-lock.json
├── package.json
├── protractor.conf.js
├── src
│   ├── app
│   │   ├── app.component.css
│   │   ├── app.component.html
│   │   ├── app.component.spec.ts
│   │   ├── app.component.ts
│   │   ├── app.module.ts
│   │   ├── app.routing.ts
│   │   ├── components
│   │   │   ├── components.module.ts
│   │   │   ├── footer
│   │   │   │   ├── footer.component.css
│   │   │   │   ├── footer.component.html
│   │   │   │   ├── footer.component.spec.ts
│   │   │   │   └── footer.component.ts
│   │   │   ├── navbar
│   │   │   │   ├── navbar.component.css
│   │   │   │   ├── navbar.component.html
│   │   │   │   ├── navbar.component.spec.ts
│   │   │   │   └── navbar.component.ts
│   │   │   └── sidebar
│   │   │       ├── sidebar.component.css
│   │   │       ├── sidebar.component.html
│   │   │       ├── sidebar.component.spec.ts
│   │   │       └── sidebar.component.ts
│   │   ├── layouts
│   │   │   └── admin-layout
│   │   │       ├── admin-layout.component.html
│   │   │       ├── admin-layout.component.scss
│   │   │       ├── admin-layout.component.spec.ts
│   │   │       ├── admin-layout.component.ts
│   │   │       ├── admin-layout.module.ts
│   │   │       └── admin-layout.routing.ts
│   │   ├── services //Pour les services api
│   │   ├── shared //Pour les éléments partagés (constant,model,...)
│   │   ├── views //Pour les views (sous modules, login,...), Si c'est l'affichage d'un écrant, il faut le mettre dans le dossier module/nom_du_module/...
│   ├── assets
│   │   ├── css
│   │   │   └── demo.css
│   │   ├── img
│   │   └── scss
│   │       ├── core
│   │       └── material-dashboard.scss
│   ├── environments
│   ├── favicon.ico
│   ├── index.html
│   ├── main.ts
│   ├── polyfills.ts
│   ├── styles.css
│   ├── test.ts
│   ├── tsconfig.app.json
│   ├── tsconfig.spec.json
│   └── typings.d.ts
├── tsconfig.json
├── tslint.json
└── typings

```
2. ### Création de module
 Pour une meilleure organisation et optimisation du projet, chaque groupe de fonctionnalités (features) doit être organisé en modules distincts avec lazy loading.

Étapes pour créer un module :
Génération du module :

bash
ng g m views/nom-du-module --routing=true --module=app
Remarque :

nom-du-module doit être en minuscules avec des traits d'union

Le flag --routing=true crée un fichier de routing dédié

2. ## _Création d'un component_
   Après avoir générer un component, il faut faire les étapes suivant :
   - Si le compenent nécéssite le layout du projet :
     - il faut enlever le component dans _app.module.ts_
     - il faut ajouter dans la variable "route", dans _app.routing.ts_ la page comme ceci : **[{ path: 'data-table', component: DataTableComponent }](#)**
     - Après on refait la même chose dans la page **[app/layouts/admin-layou/admin-layout.routing.ts](#)**,il faut ajouter dans la variable `route`, la page comme ceci : **[{ path: 'data-table', component: DataTableComponent }](#)**
     - Après, il faut déclarer le component dans **[app/layouts/admin-layou/admin-layout.module.ts](#)** dans `declaration`
     - Afin d'afficher le lien de la page dans le menu sidebar, il faut l'ajouter dans **[app/layouts/admin-layou/admin-layout.module.ts](#)** comme ceci:
       - Pour un simple menu :
       ```typescript
       export const ROUTES: RouteInfo[] = [
         {
           path: "/home",
           title: "Tableau de board",
           icon: "dashboard",
           class: "",
           children: [],
         },
       ];
       ```
       - Pour un menu avec des sous-menu:
       ```typescript
       export const ROUTES: RouteInfo[] = [
         {
           path: "/user-profile",
           title: "User Profile",
           icon: "person",
           class: "",
           children: [
             { path: "/settings/profile", title: "Profil", icon: "person" },
             { path: "/settings/security", title: "Sécurité", icon: "lock" },
             {
               path: "/settings/preferences",
               title: "Préférences",
               icon: "tune",
             },
           ],
         },
       ];
       ```
   - Si le component ne nécéssite pas le layout :
     - il faut ajouter le component dans _app.module.ts_
     - Après il faut modifier le code dans ... comme ceci :
       ```typescript
       this.showLayout = !(
         currentRoute === "/login" || currentRoute === "/laPageSansLayout"
       );
       ```
   - Le contenu HTML du component doit être dans un élément DIV avec la class : main-containt:
     ```html
     <div class="main-content"></div>
     ```

3. ## TABLE: Installation et utilisation
  Pour utiliser la datatable, il faut suivre les étapes suivants:
  - il faut déclarer d'abord les éléments importants du tableau:
    ** header, objetBody,listIcon et searchGlobal : 
      ```typescript 
        /**
         * header :
           - nomColonne : le nom du colonne qu'on doit affiché sur le tableau
           - colonneTble : le nom du colonne de la table dans la base de donnée
           - table : c'est le nom de la table des données qu'on veut affiché
        */
        header = [
          {"nomColonne" : this.__('global.date'),"colonneTable" : "datevirement","table" : "virement"},
          {"nomColonne" : this.__('global.montant') + "(" + this.__('global.currency') + ")","colonneTable" : "montant","table" : "virement"},
          {"nomColonne" : this.__('global.statut'),"colonneTable" : "statut","table" : "virement"},
          {"nomColonne" : this.__('global.date') +" "+ this.__('global.validation'),"colonneTable" : "datevalidation","table" : "virement"},
          {"nomColonne" : this.__('suivi_compte.type_compte'),"colonneTable" : "wallet_carte","table" : "virement"},
          {"nomColonne" : this.__('global.action')}
      ];

      /**
       * objetBody : c'est le retour de l'api (le rang de la ligne doit être le même que le header)
         - name : le nom du colonne depuis le body
         - type : le type du retour
      */
      objetBody = [
          {'name' : 'date_virement','type' : 'text',},
          {'name' : 'montant','type' : 'text',},
          {'name' : 'statut','type' : 'statut',},
          {'name' : 'date_validation','type' : 'text',},
          {'name' : 'wallet_carte','type' : 'text',},
          {'name' :  'state#rowid'} //Si ça retour id c'est state#id
      ];

      /**
       * listIcon : 
         - icon : le nom de l'icon
         - action : l'identification de l'action utilisé pour l'évènement
         - tooltip : pour le tooltip
         - autority : c'est le code d'autorisation (code action) 
       */
      listIcon = [
          {'icon' : 'edit','action' : 'edit','tooltip' : 'Modification','autority' : 'GCP_5',},
          {'icon' : 'check','action' : 'validation','tooltip' : 'Valider','autority' : 'GCP_6',},
          {'icon' : 'close','action' : 'rejeter','tooltip' : 'Rejeter','autority' : 'GCP_7',},
          {'icon' : 'delete','action' : 'delete','tooltip' : 'Supprimer','autority' : 'GCP_8',},
      ];

      /**
       * searchGlobal : c'est la recherche par chaque colonne
       */
      searchGlobal = [ 'virement.datevirement', 'virement.datevalidation', 'virement.user_crea','virement.user_validation']; 
      ```
  - Mise en place:
    Il faut déclarer dans constructeur un objet "PassageService", necessair pour la récupération des données et il faut déclarer un objet "Subscription", utile pour les évènements. Voici le code suivant : 
    ```typescript

      endpoint : any; // l'endpoint pour la récupération des données
      subscription: Subscription;
      idVirement : any //Utile pour la récupération de l'id ou rowid de la ligne séléctionné

      constructor(
        private passageService: PassageService,
      ) {
          super();
      }

      ngOnInit(): void {
        
        this.passageService.appelURL(null);
        this.endpoint = environment.baseUrl + '/' + environment.historique_virement;

        //Event for icon table
        this.subscription = this.passageService.getObservable().subscribe(event => {
            if(event.data){
                this.idVirement = event.data.id;
    
                if(event.data.action == 'edit') //Action pour edit;
                else if(event.data.action == 'validation') //Action pour validation;
                else if(event.data.action == 'rejeter') //Action pour l'annulation;
                else if(event.data.action == 'delete') //Action pour suppression;
        
                // Nettoyage immédiat de l'event
                this.passageService.clear();
            }
        });
    }
    ```
  - HTML
    ** Dans l'html, il suffit juste de copier le code suivant : 
    ```html
      <app-table
          [endpoint]="endpoint"
          [headerTable]="header"
          [body]="objetBody"
          [listIcon]="listIcon"
          [searchGlobal]="searchGlobal"
          [formSearch] = "false"
          [triDescDefault] = "'datevirement'"
        >
      </app-table>
    ```
4. ## Internationnalisation: 
  Le fichier lang se trouve dans le dossier : assets/i18n/fr.
  Pour l'utilsé il faut que la classe du template étand la classe Translatable :
  ```typescript
    export class HistoriqueVirementsComponent extends Translatable implements OnInit {}
  ```
  - Utilisation : 
  ```typescript
    this.__('global.currency')
  ```
  ```html
    {{ __('global.cureency') }}
  ```
