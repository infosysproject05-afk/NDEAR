import {
  StackNavigationOptions,
  StackScreenProps
} from '@react-navigation/stack'
import { DetailsScreenParams } from '../../screens'

export type SetupNavigationParamList = {
  StartStep: undefined
  PasswordStep:
    | {
        isCustomSetup: boolean
      }
    | undefined
  ProfileStep: {
    password: string
    enableBiometrics: boolean
  }
  CreateStep: {
    password: string
    enableBiometrics: boolean
    fullName: string
    dateOfBirth: string
  }
  CustomMethodStep: {
    password: string
    enableBiometrics: boolean
  }
  DetailsScreen: DetailsScreenParams
  ChapiStep: {
    password: string
    enableBiometrics: boolean
  }
}

export type StartStepProps = StackScreenProps<
  SetupNavigationParamList,
  'StartStep'
>
export type PasswordStepProps = StackScreenProps<
  SetupNavigationParamList,
  'PasswordStep'
>
export type ProfileStepProps = StackScreenProps<
  SetupNavigationParamList,
  'ProfileStep'
>
export type CreateStepProps = StackScreenProps<
  SetupNavigationParamList,
  'CreateStep'
>
export type CustomMethodStepProps = StackScreenProps<
  SetupNavigationParamList,
  'CustomMethodStep'
>
export type DetailsScreenSetupProps = StackScreenProps<
  SetupNavigationParamList,
  'DetailsScreen'
>
export type ChapiStepProps = StackScreenProps<
  SetupNavigationParamList,
  'ChapiStep'
>

export type ForFadeType = StackNavigationOptions['cardStyleInterpolator']
