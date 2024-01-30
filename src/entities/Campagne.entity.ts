import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Entreprise } from "./Entreprise.entity";
import { ApiProperty } from "@nestjs/swagger";

@Entity()
export class Campagne{
  @PrimaryGeneratedColumn()
  id:number
  
  @Column({type:'varchar', length:230})
  @ApiProperty()
  nomCampagne: string;
  @Column({type:'varchar', length:30, unique:true})
  @ApiProperty()

  codePromo:string;
  @Column({type:'date'})
  @ApiProperty()

  dateDebut: Date;
  @Column({type:'date'})
  @ApiProperty()

  dateFin: Date;
  @Column({type:'enum', enum:['10-20ans','20-30ans','30-50ans','50-60ans','60-plus']})
  @ApiProperty()

  ageCible:string;
  @Column({type:'enum', enum:['Masculin','Feminin']})
  @ApiProperty()

  sexeCible:string;
  @Column({type:'enum',enum:['Dakar', 'Thies', 'Diourbel','Fatick','Kaffrine','Kaolack','Kedougou','Kolda','Louga','Matam','Saint-Louis','Sedhiou','Tambacounda','Ziguinchor']})
  @ApiProperty()

  localisation: string;
  @Column({type:'text'})
  @ApiProperty()

  image: string;
  @Column({default:false})
  isActive:boolean;
  @Column({type:'enum',enum:['non-démarré','en cours','cloturé'], default:'non-démarré'})
  status:string;
  @ManyToOne(() => Entreprise, { nullable: false })
  @JoinColumn({ name: 'entrepriseId' })
  entreprise: Entreprise;
}