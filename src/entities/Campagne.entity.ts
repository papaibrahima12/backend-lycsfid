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

  // @IsEnum(['10-20ans','20-30ans','30-50ans','50-60ans','60-plus'],{message: "Veuillez selectionner une tranche d'age valide"})
  // @Column({type:'enum', enum:['10-20ans','20-30ans','30-50ans','50-60ans','60-plus']})
  // @ApiProperty()
  // ageCible:string;

  @IsNotEmpty({message: "Specifiez l'age cible minimal requis !"})
  @Column({type:'int', nullable:true})
  @ApiProperty()
  ageCibleMin: number;

  @IsNotEmpty({message: "Specifiez l'age cible maximal requis !"})
  @Column({type:'int', nullable:true})
  @ApiProperty()
  ageCibleMax: number;

  @IsEnum(['Masculin', 'Feminin'],{message: 'Veuillez selectionner une sexe valide' })
  @Column({type:'enum', enum:['Masculin','Feminin']})
  @ApiProperty()
  sexeCible:string;

  @IsEnum(['Regions'],{message: 'Veuillez selectionner un type valide' })
  @Column({type:'enum', enum:['Regions'], default:'Regions', nullable:true})
  @ApiProperty()
  typeDeCible: string;

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

  @Column({default:true})
  isActive:boolean;

  @Column({type:'enum',enum:['non-démarré','en cours','cloturé'], default:'non-démarré'})
  status:string;
  
  @ManyToOne(() => Entreprise, { nullable: false })
  @JoinColumn({ name: 'entrepriseId' })
  entreprise: Entreprise;
}