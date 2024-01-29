import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Entreprise } from "./Entreprise.entity";

@Entity()
export class Campagne{
  @PrimaryGeneratedColumn()
  id:number
  @Column({type:'varchar', length:230})
  nomCampagne: string;
  @Column({type:'varchar', length:30, unique:true})
  codePromo:string;
  @Column({type:'date'})
  dateDebut: Date;
  @Column({type:'date'})
  dateFin: Date;
  @Column({type:'enum', enum:['10-20ans','20-30ans','30-50ans','50-60ans','60-plus']})
  ageCible:string;
  @Column({type:'enum', enum:['Masculin','Feminin']})
  sexeCible:string;
  @Column({type:'enum',enum:['Dakar', 'Thies', 'Diourbel','Fatick','Kaffrine','Kaolack','Kedougou','Kolda','Louga','Matam','Saint-Louis','Sedhiou','Tambacounda','Ziguinchor']})
  localisation: string;
  @Column({type:'text'})
  image: string;
  @Column({default:false})
  isActive:boolean;
  @Column({type:'enum',enum:['non-démarré','en cours','cloturé'], default:'non-démarré'})
  status:string;
  @ManyToOne(() => Entreprise, { nullable: false })
  @JoinColumn({ name: 'entrepriseId' })
  entreprise: Entreprise;
}