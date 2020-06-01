import React from 'react'

import {storiesOf} from '@storybook/react'

import ExperimentProvider from '../src/ExperimentProvider'
import Experiment from '../src/components/Experiment'

const experiments = {
  1: {active: false, uuid: 1},
  2: {active: true, uuid: 2},
  3: {active: null, uuid: 3},
}

const withProvider = (story) =>
  <ExperimentProvider experiments={experiments}>
    {story()}
  </ExperimentProvider>

storiesOf('Experiment', module)
  .addDecorator(withProvider)
  .add('basic experiment', () =>
    <Experiment />)
  .add('with experiment id not found', () =>
    <Experiment experimentId="0" />)
  .add('with no active state', () =>
    <Experiment experimentId="3" />)
  .add('with Active/Inactive child, no active state', () =>
    <Experiment experimentId="3">
      <Experiment.Active>active</Experiment.Active>
      <Experiment.Inactive>inactive</Experiment.Inactive>
    </Experiment>)

storiesOf('Experiment/Active', module)
  .addDecorator(withProvider)
  .add('with no Active child (active)', () =>
    <Experiment experimentId="2">
      <Experiment.Inactive>inactive</Experiment.Inactive>
    </Experiment>)
  .add('with no Inactive child (active)', () =>
    <Experiment experimentId="2">
      <Experiment.Active>active</Experiment.Active>
    </Experiment>)
  .add('with Active/Inactive child (active)', () =>
    <Experiment experimentId="2">
      <Experiment.Active>active</Experiment.Active>
      <Experiment.Inactive>inactive</Experiment.Inactive>
    </Experiment>)

storiesOf('Experiment/Inactive', module)
  .addDecorator(withProvider)
  .add('with no Active child (inactive)', () =>
    <Experiment experimentId="1">
      <Experiment.Inactive>inactive</Experiment.Inactive>
    </Experiment>)
  .add('with no Inactive child (inactive)', () =>
    <Experiment experimentId="1">
      <Experiment.Active>active</Experiment.Active>
    </Experiment>)
  .add('with Active/Inactive child (inactive)', () =>
    <Experiment experimentId="1">
      <Experiment.Active>active</Experiment.Active>
      <Experiment.Inactive>inactive</Experiment.Inactive>
    </Experiment>)

storiesOf('Experiment/Inactive/alwaysRenderInactive', module)
  .addDecorator(withProvider)
  .add('with no Inactive child, no active state, always render inactive', () =>
    <Experiment alwaysRenderInactive={true} experimentId="1">
      <Experiment.Active>active</Experiment.Active>
    </Experiment>)
  .add('with Active/Inactive child, no active state, always render inactive', () =>
    <Experiment alwaysRenderInactive={true} experimentId="3">
      <Experiment.Active>active</Experiment.Active>
      <Experiment.Inactive>inactive</Experiment.Inactive>
    </Experiment>)
