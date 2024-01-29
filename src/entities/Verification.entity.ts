import { Column, Entity, ManyToOne, JoinColumn, PrimaryGeneratedColumn } from "typeorm";
import { Entreprise } from "./entreprise.entity"; // Assurez-vous d'ajuster le chemin d'importation en fonction de votre structure de fichiers

@Entity()
export class Verification {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, nullable: false })
  token: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  type: string;

  @ManyToOne(() => Entreprise, { nullable: false }) 
  @JoinColumn({ name: 'userId' })
  user: Entreprise;
  
}
