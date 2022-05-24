import { ReactNode } from 'react';
import {
  Transition as ReactTransition,
  TransitionGroup,
  TransitionStatus,
} from 'react-transition-group';

type TransitionKind<RC> = {
  children: RC;
  location: string;
};

const TIMEOUT: number = 300;

type TTransitionStyles = {
  [key in TransitionStatus]?: {
    [key: string]: string | number;
  };
};

const TransitionStyles: TTransitionStyles = {
  entering: {
    opacity: 0.6,
    filter: 'blur(2px)',
  },
  entered: {
    transition: `opacity ${TIMEOUT}ms ease-in-out, filter ${TIMEOUT}ms ease-in-out`,
    opacity: 1,
    filter: 'blur(0px)',
  },
  exiting: {
    position: 'absolute',
    transition: `opacity ${TIMEOUT}ms ease-in-out`,
    opacity: 0.6,
    filter: 'blur(2px)',
  },
};

const TransitionLayout: React.FC<TransitionKind<ReactNode>> = function ({ children, location }) {
  return (
    <TransitionGroup className="h-full relative overflow-hidden">
      <ReactTransition
        key={location}
        timeout={{
          enter: TIMEOUT,
          exit: TIMEOUT,
        }}>
        {(status) => (
          <div
            style={{
              ...TransitionStyles[status],
            }}>
            {children}
          </div>
        )}
      </ReactTransition>
    </TransitionGroup>
  );
};

export { TransitionLayout };
