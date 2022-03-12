import {FC, useMemo} from 'react'
import cs from 'classnames';
import styles from './pagination.module.scss';

type ComponentProps={
  count: number,
  onClick: (i:number)=>void,
  activeIndex: number,
  switchTime: number
}

const Pagination:FC<ComponentProps> = ({count, onClick, activeIndex, switchTime}) => {
  const slides = useMemo(()=>new Array(count).fill(0), [count])
  return (
    <div className={styles.pagination}>
        {slides.map((s,index)=>
           (
            <div 
              key={index.toString()} 
              className={styles.pagination__item} 
              onClick={()=>onClick(index)}
            >
              <div 
                className={cs(
                  styles.pagination__line, 
                  index === activeIndex && styles["pagination__line--inProgress"], 
                  index < activeIndex && styles["pagination__line--completed"]
                )}
              style={{animationDuration: switchTime + 'ms'}}></div>  
            </div>
          )
        )}
      </div>
  )
}

export default Pagination