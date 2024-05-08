import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, Matches, MaxLength, MinLength } from "class-validator";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;
  @ApiPropertyOptional()
  @Column({type:'varchar', length:255, nullable:true, unique:false})
  prenom: string;
  @Column({type:'varchar', length:255, nullable:true, unique:false})
  @ApiPropertyOptional()
  nom: string;
  @IsEmail({},{message:"L'adresse email est invalide !"})
  @IsNotEmpty({message:"L'adresse email est requise !"})
  @IsString({message: "L'email doit etre une chaine de caractere"})
  @Matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,3}$/g,{message:"Le format de l'email doit etre : xxx@xxx.xxx "})
  @Column({type:'varchar', length:40, nullable:false, unique:true})
  @ApiProperty({required:true})
  email: string;
  
  @IsNotEmpty({message: "L'adresse ne doit pas etre vide !"})
  @Column({type:'varchar', length: 255, nullable:true})
  @ApiProperty({required:true})
  adresse: string;

  @IsNotEmpty({message: "Le numero de téléphone est requis !"})
  @Column({type:'varchar', length:255, nullable:true})
  @ApiProperty({required:true})
  @MinLength(9,{message:"le numero de telephone doit etre au moins 9 chiffres"})
  @MaxLength(15, {message:"le numero de telephone ne doit pas depasser 15 chiffres"})
  telephone: string;

  @Column({type:'varchar',default:'admin'})
  role: string;
  @Column({type:'varchar', length:255, nullable:false})
  @ApiProperty({required:true})
  password: string;
  @Column({type:'varchar', length:255, nullable:false})
  @ApiProperty({required:true})
  new_password: string;
  @Column({ default: false })
  verified: boolean;
  @Column({type:'varchar', length:255, nullable:true})
  verificationCode: string;
  @Column({ type: 'date', default: null })
  verifiedAt: Date;
}