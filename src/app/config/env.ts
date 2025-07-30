import dotenv from "dotenv";

dotenv.config({ override: true, quiet: true });

interface EnvConfig {
 PORT : string,
 DB_URL : string,
 NODE_ENV : "development" | "production"
}

const loadEnvVariables = () : EnvConfig => {
    const requiredEnvVars: string[] = ['PORT' , 'DB_URL' , 'NODE_ENV'];

       requiredEnvVars.forEach(key => {
        if (!process.env[key]) {
            throw new Error(`Missing require environment variabl ${key}`)
        }
    })  

    return {
        PORT : process.env.PORT as string ,
         DB_URL: process.env.DB_URL as string,
        NODE_ENV : process.env.NODE_ENV  as "development" | "production"
    }
    
}


export const envVars = loadEnvVariables();