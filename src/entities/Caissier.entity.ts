import { IsEnum, IsNotEmpty, IsNumberString, Matches, MaxLength, MinLength } from "class-validator";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Entreprise } from "./Entreprise.entity";

@Entity()
export class Caissier {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({type:'varchar', length:255, nullable:true, unique:false})
  prenom: string;

  @Column({type:'varchar', length:255, nullable:true, unique:false})
  nom: string;

  // @IsString({message: "L'email doit etre une chaine de caractere"})
  // @Matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,3}$/g,{message:"Le format de l'email doit etre : xxx@xxx.xxx "})
  @Column({type:'varchar', length:40, nullable:true, unique:true})
  email: string;

  // @IsNotEmpty({message: "L'adresse ne doit pas etre vide !"})
  // @IsEnum(['Dakar', 'Thies', 'Diourbel','Fatick','Kaffrine','Kaolack','Kedougou','Kolda','Louga','Matam','Saint-Louis','Sedhiou','Tambacounda','Ziguinchor'],{message: 'Veuillez selectionner une adresse valide' })
  // @Column({type:'enum',enum:['Dakar', 'Thies', 'Diourbel','Fatick','Kaffrine','Kaolack','Kedougou','Kolda','Louga','Matam','Saint-Louis','Sedhiou','Tambacounda','Ziguinchor']})
  // adresse: string;

  @IsNotEmpty({message: "Le numero de téléphone est requis !"})
  @IsNumberString()
  @Matches(/^\+?[0-9]\d{1,15}$/,{message:"Le format du telephone doit etre 771234567 "})
  @MinLength(9,{message:"le numero de telephone doit etre au moins 9 caracteres"})
  @MaxLength(13, {message:"le numero de telephone ne doit pas depasser 13 caracteres"})
  @Column({type:'varchar', length:255, nullable:false})
  telephone: string;

  @Column({type:'varchar',default:'caissier'})
  role: string;

  @IsNotEmpty({message: "Le mot de passe est requis !"})
  @IsNumberString()
  @Matches(/^\+?[0-9]\d{0,5}$/,{message:"Le mot de passe doit etre de 6 chiffres"})
  @MinLength(6,{message:"Revoyez le nombre de caracteres svp, le mot de passe doit etre au minimum 6 caracteres"})
  @MaxLength(6,{message:"Revoyez le nombre de caracteres svp, le mot de passe doit etre au maximum 6 caracteres"})
  @Column({type:'varchar', length:255, nullable:false})
  password: string;

  @IsNotEmpty({message: "Le mot de passe est requis !"})
  @Matches(/^\+?[0-9]\d{0,5}$/,{message:"Le mot de passe doit etre de 6 chiffres"})
  @IsNumberString()
  @MinLength(6,{message:"Revoyez le nombre de caracteres svp, le mot de passe doit etre au minimum 6 caracteres"})
  @MaxLength(6,{message:"Revoyez le nombre de caracteres svp, le mot de passe doit etre au maximum 6 caracteres"})
  @Column({type:'varchar', length:255, nullable:false})
  new_password: string;

  @ManyToOne(() => Entreprise, { nullable: false })
  @JoinColumn({ name: 'entrepriseId' })
  entreprise: Entreprise;

  @Column({type:'text', nullable:true})
  refreshToken: string;

  @Column({ default: false })
  verified: boolean;

  @Column({type:'varchar', length:255, nullable:true})
  verificationCode: string;

  @Column({ type: 'date', default: null })
  verifiedAt: Date;

  @Column({ type: 'date', default: null })
  createdAt: Date;
}