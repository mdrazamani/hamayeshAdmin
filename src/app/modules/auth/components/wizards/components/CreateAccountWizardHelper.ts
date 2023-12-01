import * as Yup from 'yup'

// Define a type for pricing rule
export interface IPricingRule {
  name: string
  description: string
  number: number
  price: number
  additionalInfo?: any // Adjust the type according to your needs
}

// Extend the ICreateAccount interface
export interface ICreateAccount {
  type: string
  rules: IPricingRule[]
  // ... other existing fields
}

// Define a validation schema for pricing rule
const pricingRuleSchema = Yup.object().shape({
  name: Yup.string().required().label('Rule Name'),
  description: Yup.string().required().label('Description'),
  number: Yup.number().required().label('Number'),
  price: Yup.number().required().label('Price'),
  additionalInfo: Yup.mixed().label('Additional Info'), // Adjust validation based on actual type
})

// Update validation schema to include validation for pricing fields
const createAccountSchemas = [
  Yup.object({
    type: Yup.string().oneOf(['article']).required().label('Account Type'),
    rules: Yup.array().of(pricingRuleSchema).required().label('Pricing Rules'),
    // ... other validation objects
  }),
  // ... other steps in the schema
]

// Initial values for the form
const inits: ICreateAccount = {
  type: 'article',
  rules: [], // Initialize as an empty array or with default values
  // ... other initial values
}

export {createAccountSchemas, inits}
