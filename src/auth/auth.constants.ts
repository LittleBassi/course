import { env } from 'process';
import * as dotenv from 'dotenv';

// Carrega o arquivo .env dentro do process.env
dotenv.config();

export const JWT_CONSTANTS = {
  secret: env.APP_SECRET,
};

export interface ExtendedRequest extends Request {
  credential_component_id?: number;
}
