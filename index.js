import ExperimentContext from './src/ExperimentContext'
import ExperimentProvider from './src/ExperimentProvider'

import Condition, {Else, ElseIf, If} from './src/components/Condition'
import Experiment, {Active, Inactive} from './src/components/Experiment'
import {withExperiments} from './src/components/withExperiments'

export {
  Active,
  Condition,
  Else,
  ElseIf,
  Experiment,
  ExperimentContext,
  ExperimentProvider,
  If,
  Inactive,
  withExperiments,
}

Experiment.Provider = ExperimentProvider

export default Experiment
