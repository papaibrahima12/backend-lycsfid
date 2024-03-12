import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Entreprise } from "./Entreprise.entity";
import { Particulier } from "./Particulier.entity";

@Entity()
export class PointParEntreprise {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({type:'int', nullable: false, default:0})
  nombrePoints: number;

  @ManyToOne(() => Particulier, (particulier) => particulier.soldePoints)
  @JoinColumn({ name: 'clientId' })
  client: Particulier;

  @ManyToOne(() => Entreprise, (entreprise) => entreprise.points)
  @JoinColumn({ name: 'entrepriseId' })
  entreprise: Entreprise;
}