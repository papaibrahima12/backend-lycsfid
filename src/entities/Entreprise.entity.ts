import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsEnum, IsNotEmpty, IsString, Matches, MaxLength, MinLength } from "class-validator";
import { Column, Entity, JoinColumn, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { PointParEntreprise } from "./PointParEntreprise.entity";

@Entity()
export class Entreprise {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({type:'varchar', length:255, nullable:true, unique:false})
  prenom: string;

  @Column({type:'varchar', length:255, nullable:true, unique:false})
  nom: string;

  @IsEmail({},{message:"L'adresse email est invalide !"})
  @IsNotEmpty({message:"L'adresse email est requise !"})
  @IsString({message: "L'email doit etre une chaine de caractere"})
  @Matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,3}$/g,{message:"Le format de l'email doit etre : xxx@xxx.xxx "})
  @Column({type:'varchar', length:40, nullable:false, unique:true})
  @ApiProperty({required:true})
  email: string;

  @IsNotEmpty({message: "L'adresse ne doit pas etre vide !"})
  @IsEnum(['Dakar', 'Thies', 'Diourbel','Fatick','Kaffrine','Kaolack','Kedougou','Kolda','Louga','Matam','Saint-Louis','Sedhiou','Tambacounda','Ziguinchor'],{message: 'Veuillez selectionner une adresse valide' })
  @Column({type:'enum',enum:['Dakar', 'Thies', 'Diourbel','Fatick','Kaffrine','Kaolack','Kedougou','Kolda','Louga','Matam','Saint-Louis','Sedhiou','Tambacounda','Ziguinchor']})
  @ApiProperty({required:true})
  adresse: string;

  @IsNotEmpty({message: "Le numero de téléphone est requis !"})
  @Column({type:'varchar', length:255, nullable:false})
  @ApiProperty({required:true})
  @MinLength(9,{message:"le numero de telephone doit etre au moins 9 chiffres"})
  @MaxLength(12, {message:"le numero de telephone ne doit pas depasser 15 chiffres"})
  telephone: string;

  @Column({type:'varchar',default:'entreprise'})
  role: string;

  @IsNotEmpty({message: "Le nom de l'entreprise est requis !"})
  @Column({type:'varchar', length:255, nullable:true})
  @ApiProperty({required:true})
  nomEntreprise:string;

  @IsNotEmpty({message: "Le ninea est requis !"})
  @MaxLength(10,{message:"Revoyez le nombre de caracteres svp, le ninea doit etre de 10 caracteres"})
  @MinLength(10,{message:"Revoyez le nombre de caracteres svp, le ninea doit etre de 10 caracteres"})
  @Column({type:'varchar', length:255, nullable:false})
  @ApiProperty({required:false})
  ninea:string;

  @Column({type:'varchar', length:255, nullable:true})
  groupe:string;

  @Column({type:'varchar', length:255, nullable:true})
  sousGroupe:string;

  @Column({type:'varchar', length:255, nullable:true})
  contactRef:string;

  @Column({type:'varchar', length:255, nullable:true})
  imageProfil:string;

  @IsNotEmpty({message: "Le mot de passe est requis !"})
  @MinLength(8,{message:"Revoyez le nombre de caracteres svp, le mot de passe doit etre au minimum 8 caracteres"})
  @Column({type:'varchar', length:255, nullable:false})
  @ApiProperty({required:true})
  password: string;

  @IsNotEmpty({message: "La confirmation du mot de passe est requise !"})
  @MinLength(8,{message:"Revoyez le nombre de caracteres svp, la confirmation du mot de passe doit etre au minimum 8 caracteres"})
  @Column({type:'varchar', length:255, nullable:false})
  @ApiProperty({required:true})
  new_password: string;

  @OneToMany(() => PointParEntreprise, (point) => point.entreprise)
  points: PointParEntreprise[];

  @Column({type:'text', nullable:true})
  token: string;

  @Column({ default: false })
  verified: boolean;

  @Column({type:'varchar', length:255, nullable:true})
  verificationCode: string;

  @Column({ type: 'date', default: null })
  verifiedAt: Date;
}