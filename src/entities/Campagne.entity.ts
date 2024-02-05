import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Entreprise } from "./Entreprise.entity";
import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty } from "class-validator";

@Entity()
export class Campagne{
  @PrimaryGeneratedColumn()
  id:number
  
  @Column({type:'varchar', length:230})
  @ApiProperty()
  nomCampagne: string;

  @IsNotEmpty({message: "Le code Promo est requis !"})
  @Column({type:'varchar', length:30, unique:true})
  @ApiProperty()
  codePromo:string;

  @IsNotEmpty({message: "La date de debut est requise !"})
  @Column({type:'date'})
  @ApiProperty()
  dateDebut: Date;

  @IsNotEmpty({message: "La date de fin est requise !"})
  @Column({type:'date'})
  @ApiProperty()
  dateFin: Date;

  @IsEnum(['10-20ans','20-30ans','30-50ans','50-60ans','60-plus'],{message: "Veuillez selectionner une tranche d'age valide"})
  @Column({type:'enum', enum:['10-20ans','20-30ans','30-50ans','50-60ans','60-plus']})
  @ApiProperty()
  ageCible:string;

  @IsEnum(['Masculin', 'Feminin'],{message: 'Veuillez selectionner une sexe valide' })
  @Column({type:'enum', enum:['Masculin','Feminin']})
  @ApiProperty()
  sexeCible:string;

  @IsNotEmpty({ message: 'Veuillez selectionner une adresse valide' })
  @Column({
        type: 'jsonb',
        array: false,
        default: () => "'[]'",
        nullable: false,
    })
  @ApiProperty({ isArray: true, example: ['Dakar', 'Thies', '...'] })
  localisation: Array<{name:string}>;

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