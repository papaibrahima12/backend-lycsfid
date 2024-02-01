import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Entreprise } from "./Entreprise.entity";
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from "class-validator";

@Entity()
export class Bon {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({type:'varchar',length:255,nullable:true})
  @ApiPropertyOptional({required:false})
  nomBon: string;

  @IsNotEmpty({message: "La date de debut ne doit pas etre vide !"})
  @Column({type:'date',nullable:true})
  @ApiProperty({required:true})
  dateDebut: Date;

  @IsNotEmpty({message: "La date de fin ne doit pas etre vide !"})
  @Column({type:'date',nullable:true})
  @ApiProperty({required:true})
  dateFin: Date;

  @IsNotEmpty({message: "La type de bon est requis !"})
  @Column({type:'varchar', length:220})
  @ApiPropertyOptional()
  typeBon: string;

  @IsEnum(['montant', 'taux'],{message: 'Veuillez selectionner un type de reduction valide valide' })
  @Column({type:'enum', enum:['montant','taux']})
  @ApiProperty({required:true})
  typeReduction: string;

  @IsNotEmpty({message: "La code de reduction est requis !"})
  @Column({type:'varchar',length:255,nullable:true})
  @ApiPropertyOptional()
  codeReduction: string;

  @IsNotEmpty({message: "Specifiez le taux/montant de reduction !"})
  @Column({type:'varchar',length:25, nullable:true})
  @ApiProperty()
  reduction: string;

  @IsEnum(['10-20ans','20-30ans','30-50ans','50-60ans','60-plus'],{message: "Veuillez selectionner une tranche d'age valide"})
  @Column({type:'enum', enum:['10-20ans','20-30ans','30-50ans','50-60ans','60-plus'],nullable:true})
  @ApiProperty()
  ageCible: string;

  @IsEnum(['Masculin', 'Feminin'],{message: 'Veuillez selectionner une sexe valide' })
  @Column({type:'enum', enum:['Masculin','Feminin']})
  @ApiProperty()
  sexeCible: string;

  @IsEnum(['Dakar', 'Thies', 'Diourbel','Fatick','Kaffrine','Kaolack','Kedougou','Kolda','Louga','Matam','Saint-Louis','Sedhiou','Tambacounda','Ziguinchor'],{message: 'Veuillez selectionner une adresse valide' })
  @Column({type:'enum', enum:['Dakar','Thies','Diourbel','Fatick','Kaffrine','Kaolack','Kedougou','Kolda','Louga','Matam','Saint-Louis','Sedhiou','Tambacounda','Ziguinchor']})
  @ApiProperty()
  localisation: string;

  @Column({type:'varchar',length:255})
  @ApiProperty()
  image: string;

  @Column({default:false})
  isActive: boolean;

  @Column({type:'enum', enum:['consommé','non-consommé','cloturé'], default:'non-consommé'})
  status: string;

  @ManyToOne(() => Entreprise, { nullable:false })
  @JoinColumn({ name: 'entrepriseId' })
  entreprise: Entreprise;
}
