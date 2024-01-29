import { IsEmail, IsEmpty } from "class-validator";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Entreprise {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({type:'varchar', length:255, nullable:true, unique:false, name:'prenom'})
  prenom: string;
  @Column({type:'varchar', length:255, nullable:true, unique:false, name:'nom'})
  nom: string;
  @IsEmail()
  @Column({type:'varchar', length:40, nullable:false, unique:true})
  email: string;
  @IsEmpty()
  @Column({type:'enum',enum:['Dakar', 'Thies', 'Diourbel','Fatick','Kaffrine','Kaolack','Kedougou','Kolda','Louga','Matam','Saint-Louis','Sedhiou','Tambacounda','Ziguinchor']})
  adresse: string;
  @Column({type:'varchar', length:255, nullable:false})
  telephone: string;
  @Column({type:'varchar',default:'entreprise'})
  role: string;
  @Column({type:'varchar', length:255, nullable:false})
  ninea:string;
  @Column({type:'varchar', length:255, nullable:true})
  groupe:string;
  @Column({type:'varchar', length:255, nullable:true})
  sousGroupe:string;
  @Column({type:'varchar', length:255, nullable:true})
  contactRef:string;
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