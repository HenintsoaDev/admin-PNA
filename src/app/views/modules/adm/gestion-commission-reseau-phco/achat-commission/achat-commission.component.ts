import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { RessourceService } from 'app/services/ressource.service';
import { ToastrService } from 'ngx-toastr';
import { Translatable } from 'shared/constants/Translatable';

@Component({
  selector: 'app-achat-commission',
  templateUrl: './achat-commission.component.html',
  styleUrls: ['./achat-commission.component.scss']
})
export class AchatCommissionComponent extends Translatable implements OnInit {

  listPartenaireActive = [];
  searchControlPartenaire = new FormControl('');
  partenaireId: number = -1;
  partenaireLabel: string = "";
  filteredPartenaire = [];

  listMoisActive = [
    { code: '01', nom: 'Janvier' },
    { code: '02', nom: 'Février' },
    { code: '03', nom: 'Mars' },
    { code: '04', nom: 'Avril' },
    { code: '05', nom: 'Mai' },
    { code: '06', nom: 'Juin' },
    { code: '07', nom: 'Juillet' },
    { code: '08', nom: 'Août' },
    { code: '09', nom: 'Septembre' },
    { code: '10', nom: 'Octobre' },
    { code: '11', nom: 'Novembre' },
    { code: '12', nom: 'Décembre' }
  ];
  searchControlMois = new FormControl('');
  codeMois: number = -1;
  moisLabel: string = "";
  filteredMois = [];


  typeCompte: any;
  loadingData: any;
  title: any = "";
  mois: any;

  listeAnneesDisponibles: string[] = [];
  searchControlAnnee = new FormControl('');
  codeAnnee: number = -1;
  anneeLabel: string = "";
  filteredAnnee = [];
  annee: any;
  commission: any = [];

  constructor(      
    private ressourceService: RessourceService,
    private toastr: ToastrService, 

    ) {
    super();
   }

  ngOnInit(): void {

    this.ressourceService.getListPartenaire().subscribe({
      next: (res) => {
          if(res['code'] == 200) {
              console.log(res);
              this.listPartenaireActive = res['data'];
              this.filteredPartenaire = this.listPartenaireActive;
          }
          else{
              this.toastr.error(res['msg'], this.__("global.error"));
          }               
      },
      error: (err) => {}
  });

  this.filteredMois = this.listMoisActive;

  const currentYear = new Date().getFullYear();
  this.listeAnneesDisponibles = Array.from({ length: 7 }, (_, i) => (currentYear - i).toString());
  this.filteredAnnee = this.listeAnneesDisponibles;


  this.searchControlPartenaire.valueChanges.subscribe(value => {
    const lower = value?.toLowerCase() || '';
    this.filteredPartenaire = this.listPartenaireActive.filter(partenaire =>
      partenaire.nom.toLowerCase().includes(lower)
    );
  });

  this.searchControlMois.valueChanges.subscribe(value => {
    const lower = value?.toLowerCase() || '';
    this.filteredMois = this.listMoisActive.filter(mois =>
      mois.nom.toLowerCase().includes(lower)
    );
  });

  this.searchControlAnnee.valueChanges.subscribe(value => {
    const lower = value?.toLowerCase() || '';
    this.filteredAnnee = this.listeAnneesDisponibles.filter(annee =>
      annee.toLowerCase().includes(lower)
    );
  });

  }

}
