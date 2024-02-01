import { IsEnum, IsNotEmpty, IsString, Matches, MaxLength, MinLength } from "class-validator";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Particulier {
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

  @IsNotEmpty({ message: 'La date de naissance ne doit pas être vide et au format YYYY-MM-DD' })
  @Column({type:'date', nullable:false, unique:false})
  birthDate: Date;

  @IsNotEmpty({message: "L'adresse ne doit pas etre vide !"})
  @IsEnum(['Dakar', 'Thies', 'Diourbel','Fatick','Kaffrine','Kaolack','Kedougou','Kolda','Louga','Matam','Saint-Louis','Sedhiou','Tambacounda','Ziguinchor'],{message: 'Veuillez selectionner une adresse valide' })
  @Column({type:'enum',enum:['Dakar', 'Thies', 'Diourbel','Fatick','Kaffrine','Kaolack','Kedougou','Kolda','Louga','Matam','Saint-Louis','Sedhiou','Tambacounda','Ziguinchor']})
  adresse: string;

  @IsNotEmpty({message: "Le numero de téléphone est requis !"})
  @MinLength(9,{message:"le numero de telephone doit etre au moins 9 chiffres"})
  @MaxLength(12, {message:"le numero de telephone ne doit pas depasser 12 chiffres"})
  @Column({type:'varchar', length:255, nullable:false})
  telephone: string;

  @Column({type:'varchar',default:'client'})
  role: string;

  @IsNotEmpty({message: "Le mot de passe est requis !"})
  @MinLength(6,{message:"Revoyez le nombre de caracteres svp, le mot de passe doit etre au minimum 6 caracteres"})
  @Column({type:'varchar', length:255, nullable:false})
  password: string;

  @IsNotEmpty({message: "La confirmation du mot de passe est requise !"})
  @MinLength(6,{message:"Revoyez le nombre de caracteres svp, la confirmation du mot de passe doit etre au minimum 6 caracteres"})
  @Column({type:'varchar', length:255, nullable:false})
  new_password: string;

  @Column({ default: false })
  verified: boolean;

  @Column({type:'varchar', length:255, nullable:true})
  verificationCode: string;

  @Column({ type: 'date', default: null })
  verifiedAt: Date;
}