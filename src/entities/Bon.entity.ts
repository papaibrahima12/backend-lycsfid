import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Entreprise } from "./Entreprise.entity";
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

@Entity()
export class Bon {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({type:'varchar',length:255,nullable:true})
  @ApiPropertyOptional({required:false})
  nomBon: string;

  @Column({type:'date',nullable:true})
  @ApiProperty({required:true})
  dateDebut: Date;

  @Column({type:'date',nullable:true})
  @ApiProperty({required:true})
  dateFin: Date;

  @Column({type:'varchar', length:220,nullable:true})
  @ApiPropertyOptional()
  typeBon: string;

  @Column({type:'enum', enum:['montant','taux']})
  @ApiProperty({required:true})
  typeReduction: string;

  @Column({type:'varchar',length:255,nullable:true})
  @ApiPropertyOptional()
  codeReduction: string;

  @Column({type:'varchar',length:25})
  @ApiProperty()
  reduction: string;

  @Column({type:'enum', enum:['10-20ans','20-30ans','30-50ans','50-60ans','60-plus']})
  @ApiProperty({required:true})
  ageCible: string;

  @Column({type:'enum', enum:['Masculin','Feminin']})
  @ApiProperty({required:true})
  sexeCible: string;

  @Column({type:'enum', enum:['Dakar','Thies','Diourbel','Fatick','Kaffrine','Kaolack','Kedougou','Kolda','Louga','Matam','Saint-Louis','Sedhiou','Tambacounda','Ziguinchor']})
  @ApiProperty({required:true})
  localisation: string;

  @Column({})
  @ApiProperty()
  image: string;

  @Column({default:false})
  isActive: boolean;

  @Column({type:'enum', enum:['consommé','non-consommé','cloturé'], default:'non-consommé'})
  status: string;

  @ManyToOne(() => Entreprise, { nullable: false })
  @JoinColumn({ name: 'entrepriseId' })
  entreprise: Entreprise;
}
