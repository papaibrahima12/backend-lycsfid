import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({type:'varchar', length:255, nullable:true, unique:false})
  prenom: string;
  @Column({type:'varchar', length:255, nullable:true, unique:false})
  nom: string;
  @Column({type:'varchar', length:40, nullable:false, unique:true})
  email: string;
  @Column({type:'enum',enum:['Dakar', 'Thies', 'Diourbel','Fatick','Kaffrine','Kaolack','Kedougou','Kolda','Louga','Matam','Saint-Louis','Sedhiou','Tambacounda','Ziguinchor']})
  adresse: string;
  @Column({type:'varchar', length:255, nullable:true})
  telephone: string;
  @Column({type:'varchar',default:'admin'})
  role: string;
  @Column({type:'varchar', length:255, nullable:false})
  password: string;
  @Column({type:'varchar', length:255, nullable:false})
  new_password: string;
  @Column({ default: false })
  verified: boolean;
  @Column({type:'varchar', length:255, nullable:true})
  verificationCode: string;
  @Column({ type: 'date', default: null })
  verifiedAt: Date;
}