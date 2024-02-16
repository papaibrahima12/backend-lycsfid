import { ApiProperty } from "@nestjs/swagger";
import { IsEnum } from "class-validator";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Entreprise } from "./Entreprise.entity";

@Entity()
export class Program {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, nullable: false })
  @ApiProperty({ required: true })
  nomProgram: string;

  @IsEnum(['palier achat', 'seuil achat'], { message: 'Veuillez selectionner un systeme de points valide' })
  @Column({ type: 'enum', enum: ['palier achat', 'seuil achat'], nullable: false })
  @ApiProperty({ required: true })
  systemePoint: string;

  @Column({ type: 'int', nullable: true })
  montant: number;

  @Column({ type: 'int', nullable: true })
  nombrePoints: number;

  @Column({ default: true })
  isActive: boolean;

  @ManyToOne(() => Entreprise, { nullable: false })
  @JoinColumn({ name: 'entrepriseId' })
  entreprise: Entreprise;
}
