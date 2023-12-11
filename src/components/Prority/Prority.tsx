import './prority.css'
import AddTask from '../Task/Add_Task/Add_Task';
import ProrityTask from '../Task/Prority_Task/Prority_Task';
import { useEffect, useState } from 'react';
import { Select} from 'antd';
import { useQuery, gql } from '@apollo/client'

const GET_ALL_TASKS = gql`query AllTasks {
    task(where: {finished: {_eq: false}}, order_by: {priority_id: asc}) {
      due_date
      id
      description
      task_name
      due_time
      priority_id
    }
  }
  
`

function Prority(){

    const { data, loading } = useQuery(GET_ALL_TASKS, {
        onCompleted(data) {
            setTaskList(data.task)
        },
        onError(err) {
            console.log(err)
        }
    });


    const [taskList,setTaskList] = useState<any>([])

    function handleTaskComplete(task_id:number){
        //API
        const newTaskList = taskList.filter((task:any)=>{
            return task.id !== task_id
        })
        setTaskList(newTaskList);

    }
    function handleAddTask(task_id: number, task_name: string, task_desc: string, due_date: any, priority_id: number, labels: any, due_time: any) {
        //API
        const newtask = {
            id: task_id,
            task_name: task_name,
            description: task_desc,
            due_date: due_date,
            priority_id: priority_id,
            labels_id: labels,
            due_time: due_time
        }
        const newTaskList = [...taskList, newtask]
        newTaskList.sort(function(a, b) {
            return a.priority_id - b.priority_id
        })
        setTaskList(newTaskList)
    }
    function handleEditTask(task_id:number,task_name:string, task_desc:string, due_date:any, priority_id:number,labels:any, due_time: any){
        //API
        const newtask = {
            id : task_id,
            task_name: task_name,
            description: task_desc,
            due_date: due_date,
            priority_id: priority_id,
            labels_id: labels,
            due_time: due_time
        }
        const newTaskList: Array<any> = taskList.map((task:any)=>{
            return newtask.id === task.id ? newtask : task
        })
        newTaskList.sort(function(a, b) {
            return a.priority_id - b.priority_id
        })
        setTaskList(newTaskList)
    }

    const handleChangeSelect = (value: string) => {
        const reversedArray = [...taskList].reverse();
        setTaskList(reversedArray)
    };
    

    return(
        <div className="prority_container px-14 w-full flex flex-col items-center">
            <div className="prority_header flex items-center justify-between pt-12  pb-3">
                <div className='prority_header_title text-xl font-bold leading-9'>
                    Prority
                </div>
                <Select
                defaultValue="1"
                style={{ width: 120 }}
                onChange={handleChangeSelect}
                options={[
                    { value: '1', label: 'P1 -> P4' },
                    { value: '2', label: 'P4 -> P1' },
                ]}
                />
            </div>
            <div className="prority_body">
                <div className='prority_tasklist space-y-2'>
                    {
                        taskList.map((task:any,index:any)=>{
                            return(
                                <ProrityTask 
                                    key = {index}
                                    task ={task}
                                    handleTaskComplete ={handleTaskComplete}
                                    handleEditTask = {handleEditTask}
                                />
                            )
                        })
                    }
                </div>
                <AddTask
                    handleAddTask= {handleAddTask}
                />
            </div>
            <div style={{height: "1000px"}}></div>
        </div>
    )
}
export default Prority;
