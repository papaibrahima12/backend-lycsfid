import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Entreprise } from "./Entreprise.entity";

@Entity()
export class Bon {
  @PrimaryGeneratedColumn()
  id:number;
  @Column({type:'varchar',length:255,nullable:true})
  nomBon: string;
  @Column({type:'date',nullable:true})
  dateDebut: Date;
  @Column({type:'date',nullable:true})
  dateFin: Date;
  @Column({type:'varchar', length:220,nullable:true})
  typeBon:string;
  @Column({type:'enum', enum:['montant','taux']})
  typeReduction:string;
  @Column({type:'varchar',length:255,nullable:true})
  codeReduction:string;
  @Column({type:'varchar',length:25})
  reduction:string;
  @Column({type:'enum', enum:['10-20ans','20-30ans','30-50ans','50-60ans','60-plus']})
  ageCible:string;
  @Column({type:'enum', enum:['Masculin','Feminin']})
  sexeCible:string;
  @Column({type:'enum', enum:['Dakar','Thies','Diourbel','Fatick','Kaffrine','Kaolack','Kedougou','Kolda','Louga','Matam','Saint-Louis','Sedhiou','Tambacounda','Ziguinchor']})
  localisation: string;
  @Column({})
  image: string;
  @Column({default:false})
  isActive:boolean;
  @Column({type:'enum', enum:['consommé','non-consommé','cloturé'], default:'non-consommé'})
  status:string;
  @ManyToOne(() => Entreprise, { nullable: false })
  @JoinColumn({ name: 'entrepriseId' })
  entreprise: Entreprise;
}