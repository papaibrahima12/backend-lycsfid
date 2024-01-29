import { Column, Entity, ManyToOne, JoinColumn, PrimaryGeneratedColumn } from "typeorm";
import { Entreprise } from "./Entreprise.entity";

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
