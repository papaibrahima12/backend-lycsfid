import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
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
  @Column({type:'varchar', length:40, nullable:false, unique:true})
  @ApiProperty({required:true})
  email: string;
  @Column({type:'enum',enum:['Dakar', 'Thies', 'Diourbel','Fatick','Kaffrine','Kaolack','Kedougou','Kolda','Louga','Matam','Saint-Louis','Sedhiou','Tambacounda','Ziguinchor']})
  @ApiProperty({required:true})
  adresse: string;
  @Column({type:'varchar', length:255, nullable:true})
  @ApiProperty({required:true})
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