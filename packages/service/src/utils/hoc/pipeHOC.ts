import React from 'react'

type Component = React.ComponentType<any> | React.JSXElementConstructor<any>

interface PipeHoc {
  <C extends Component, CR1 extends Component>(c: C, f1: (c: C) => CR1): CR1
  <C extends Component, CR1 extends Component, CR2 extends Component>(c: C, f1: (c: C) => CR1, f2: (c: CR1) => CR2): CR2
  <C extends Component, CR1 extends Component, CR2 extends Component, CR3 extends Component>(
    c: C,
    f1: (c: C) => CR1,
    f2: (c: CR1) => CR2,
    f3: (c: CR2) => CR3,
  ): CR3
  <C extends Component, CR1 extends Component, CR2 extends Component, CR3 extends Component, CR4 extends Component>(
    c: C,
    f1: (c: C) => CR1,
    f2: (c: CR1) => CR2,
    f3: (c: CR2) => CR3,
    f4: (c: CR3) => CR4,
  ): CR4
  <
    C extends Component,
    CR1 extends Component,
    CR2 extends Component,
    CR3 extends Component,
    CR4 extends Component,
    CR5 extends Component,
  >(
    c: C,
    f1: (c: C) => CR1,
    f2: (c: CR1) => CR2,
    f3: (c: CR2) => CR3,
    f4: (c: CR3) => CR4,
    f5: (c: CR4) => CR5,
  ): CR5
  // Add more if need
}

/*
 * Component 와 다수의 HOC 를 합성하는 함수
 * pipeHOC(Component, f1, f2, f3 ,f4, f5) = f5(f4(f3(f2(f1(Component)))))
 */
const pipeHOC: PipeHoc = (component, ...hocs) => hocs.reduce((component, hoc) => hoc(component), component)

export default pipeHOC
