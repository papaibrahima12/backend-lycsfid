import { IsEmpty, IsNotEmpty } from "class-validator";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Particulier {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({type:'varchar', length:255, nullable:true, unique:false})
  prenom: string;
  @Column({type:'varchar', length:255, nullable:true, unique:false})
  nom: string;
  @IsNotEmpty()
  @Column({type:'varchar', length:40, nullable:true, unique:true})
  email: string;
  @IsNotEmpty()
  @Column({type:'date', nullable:false, unique:false})
  birthDate: Date;
  @IsNotEmpty()
  @Column({type:'enum',enum:['Dakar', 'Thies', 'Diourbel','Fatick','Kaffrine','Kaolack','Kedougou','Kolda','Louga','Matam','Saint-Louis','Sedhiou','Tambacounda','Ziguinchor']})
  adresse: string;
  @IsNotEmpty()
  @Column({type:'varchar', length:255, nullable:false})
  telephone: string;
  @Column({type:'varchar',default:'client'})
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