import React, { useState } from 'react';
import {
  ChakraProvider,
  Text,
  theme,
  Center,
  Checkbox,
  Stack,
  Input,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  FormLabel,
  Button,
  OrderedList,
  ListItem,
  HStack,
} from '@chakra-ui/react';
import _ from 'lodash';

function App() {
  const [startPlan, setStartPlan] = useState({});
  const [endPlan, setEndPlan] = useState({});
  const [name, setName] = useState('');
  const [start, setStart] = useState(0);
  const [end, setEnd] = useState(23);
  const [plans, addPlan] = useState([]);

  function makeRecommendation() {
    const plans = localStorage.getItem('plans');
    const achieved = localStorage.getItem('achieved');
    if (!plans) return "You haven't set any goals today";
    if (!achieved) return "You haven't achieved any goals today";
    const calc = Math.round(achieved.length / plans.length) * 100;
    let result;
    switch (calc) {
      case 100:
        result = "You set the goals and you went for them, You're a champion";
        break;
      case 80:
      case 90:
        result = "You're destined for success, put extra effort";
        break;
      case 50:
      case 60:
      case 70:
        result = 'Getting there, put more effort';
        break;
      case 10:
      case 20:
      case 30:
      case 40:
        result = 'You have to set your eyes on those goals';
        break;
      default:
        result = '';
    }
    return result;
  }
  let toRender = (
    <Stack spacing="4">
      <Text>{makeRecommendation()}</Text>
      <Input value={name} onChange={e => setName(e.target.value)} />
      <FormLabel htmlFor="start">Start hour </FormLabel>
      <NumberInput defaultValue={9} min={0} max={23} id="start">
        <NumberInputField onChange={e => setStart(e.target.value)} />
        <NumberInputStepper>
          <NumberIncrementStepper />
          <NumberDecrementStepper />
        </NumberInputStepper>
      </NumberInput>
      <FormLabel htmlFor="end">End hour</FormLabel>
      <NumberInput defaultValue={15} min={0} max={23} id="end">
        <NumberInputField onChange={e => setEnd(e.target.value)} />
        <NumberInputStepper>
          <NumberIncrementStepper />
          <NumberDecrementStepper />
        </NumberInputStepper>
      </NumberInput>
      <Button
        size="sm"
        colorScheme="gray"
        onClick={() => {
          addPlan(plans.concat([{ name, start, end }]));
        }}
      >
        Add plan
      </Button>
      <OrderedList>
        {plans.map((plan, index) => (
          <ListItem key={index}>
            <Text>{plan.name}</Text>
            <HStack>
              <Text>Start {plan.start}</Text>
              <Text>End {plan.end}</Text>
            </HStack>
          </ListItem>
        ))}
      </OrderedList>
      <Button
        colorScheme="teal"
        onClick={() => {
          localStorage.setItem('plans', plans);
          plans.forEach((plan, index) => {
            const startDuration =
              (plan.start - new Date().getHours()) * 60 * 60 * 1000;
            const endDuration =
              (plan.end - new Date().getHours()) * 60 * 60 * 1000;
            setTimeout(setStartPlan(plan), startDuration);
            setTimeout(() => {
              if (index === plans.length - 1) {
                localStorage.removeItem('plans');
                localStorage.removeItem('achieved');
              }
              setEndPlan(plan);
            }, endDuration);
          });
          addPlan([]);
        }}
      >
        Start your day
      </Button>
    </Stack>
  );
  if (!_.isEmpty(startPlan)) toRender = <Text>Start {startPlan.name} now</Text>;
  if (!_.isEmpty(endPlan))
    toRender = (
      <Checkbox
        onChange={e => {
          if (e.target.checked) {
            const achieved = localStorage.getItem('achieved')
              ? localStorage.getItem('achieved')
              : [];
            achieved.push(endPlan);
            localStorage.setItem('achieved', achieved);
            toRender = <Text>Plan your life</Text>;
          }
        }}
      >
        Check if you went through with {endPlan.name}
      </Checkbox>
    );

  return (
    <ChakraProvider theme={theme}>
      <Center>{toRender}</Center>
    </ChakraProvider>
  );
}

export default App;
