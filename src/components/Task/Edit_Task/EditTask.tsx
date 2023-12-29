import { useState } from 'react';
import './edittask.css'
import DueDate from '../../DropDown/DueDate/DueDate';
import PrioritySelect from '../../DropDown/Priority/PrioritySelect';
import LabelSelect from '../../DropDown/Lables/LablesSelect';
import { gql, useMutation } from '@apollo/client';
import { toast } from 'react-toastify';
import { useAuth } from '../../../context/auth';

const EDIT_TASK_BY_ID = gql`mutation MyMutation($id: Int!, $desc: String, $due_date: date, $due_time: time, $priority_id: Int, $task_name: String!,  $labels_id: [Int!] ) {
    update_task_by_pk(pk_columns: {id: $id}, _set: {description: $desc, due_date: $due_date, due_time: $due_time, priority_id: $priority_id, task_name: $task_name, labels_id: $labels_id}) {
      task_name
    }
  }
`
const ADD_TASK = gql`mutation MyMutation($desc: String, $due_date: date, $due_time: time, $task_name: String, $priority_id: Int, $labels_id: [Int!], $user_id: Int!) {
    insert_task_one(object: {description: $desc, due_date: $due_date, due_time: $due_time, task_name: $task_name, priority_id: $priority_id, user_id: $user_id, labels_id: $labels_id}) {
      task_name
      id
    }
  }
`

function parseArrayToInt4(arr: Array<number>):string {
    return "{" + arr.join(',') + "}";
}

function TaskEditor(props: any) {

    const {userId} = useAuth()
    const [newId, setNewId] = useState<number>(0)
    const [title, setTitle] = useState<string>(props.task.task_name)
    const [desc, setDesc] = useState<string>(props.task.description)
    const [due_date, setDueDate] = useState<string | null>(props.task.due_date)
    const [due_time, setDueTime] = useState<string | null>(props.task.due_time)
    const [priorityId, setpriorityId] = useState<number>(props.task.priority_id? props.task.priority_id : 4)
    const [labelsId, setLabelsId] = useState<number[]>(props.task.labels_id ? props.task.labels_id : []) 

    const [editTask, { data: data2, loading: loading2 }] = useMutation(EDIT_TASK_BY_ID, {
        update(_, result) {
            toast.info("You edited task " + title)
        },
        variables: {
            id: props.task.id,
            task_name: title,
            desc: desc,
            due_date: due_date,
            due_time: due_time,
            priority_id: priorityId,
            labels_id: labelsId.length > 0 ? parseArrayToInt4(labelsId) : null
        }
    })
    function EditTask() {
        editTask();
    }

    const [addTask, { data: data3 }] = useMutation(ADD_TASK, {
        update(_, result) {
            setNewId(result.data.insert_task_one.id)
            toast.info("You added new task " + title)
        },
        variables: {
            task_name: title,
            desc: desc,
            due_date: due_date,
            due_time: due_time,
            priority_id: priorityId,
            user_id: userId
        }
    })
    function AddTask() {
        addTask()
    }

    function handleSubmit(e: any) {
        e.preventDefault();
        if (props.SubmitString === "Save") {
            EditTask()
            props.handleSubmitClick(props.task.id, title, desc, due_date, priorityId, labelsId, due_time);
            props.handleCancelClick();
        }
        if (props.SubmitString === "Add Task") {
            AddTask()
            props.handleSubmitClick(newId, title, desc, due_date, priorityId, labelsId, due_time);
            props.handleCancelClick();
        }
    }


    function onChangeDueDate(str: string) {
        setDueDate(str)
    }
    function onChangeDueTime(str: string) {
        setDueTime(str)
    }
    function onChangePriority(p_id: number) {
        setpriorityId(p_id)
    }
    function onChangeLabel(l_id: number) {
        if (labelsId.includes(l_id)) {
            const newLables = labelsId.filter((label) => { return label !== l_id })
            setLabelsId(newLables)
        }
        else {
            const newLables = [...labelsId, l_id]
            setLabelsId(newLables)
        }
    }

    return (
        <form action="" className="task_editor w-full border border-gray-300 rounded mt-1 bg-white">
            <div className="task_editor_area pt-2.5 px-2.5">
                <div className="task_editor_input_field mb-2.5">
                    <div className="task_editor_title_input w-full text-sm font-semibold leading-6">
                        <input className='w-full focus:outline-none' onChange={(e) => { setTitle(e.target.value) }} type="text" name="task_editor_title" id="task_editor_title" placeholder="Task name" value={title} />
                    </div>
                    <div className="task_editor_desc_input w-full text-xs font-light leading-6">
                        <textarea className='w-full focus:outline-none' onChange={(e) => { setDesc(e.target.value) }} name="task_editor_desc" id="task_editor_desc" placeholder="Description" value={desc}></textarea>
                    </div>
                </div>
                <div className="task_editor_select_area flex space-x-2 mb-3">
                    <DueDate due_date={due_date} onChangeDueDate={onChangeDueDate} due_time={due_time} onChangeDueTime={onChangeDueTime} />
                    <PrioritySelect priority_id={priorityId} onChangePriority={onChangePriority} />
                    <LabelSelect labelIdSelectList={labelsId} onChangeLabel={onChangeLabel} />
                </div>
            </div>
            <div className="task_editor_footer flex justify-end space-x-2.5 mt-2 py-2 pl-2 pr-3 border-t border-gray-300">
                <button onClick={(e) => { e.preventDefault(); props.handleCancelClick(); }} className="task_editor_cancle_btn px-3 border rounded border-transparent text-sm text-slate-500 font-medium leading-8 hover:bg-gray-200">
                    Cancel
                </button>
                <button onClick={handleSubmit} type="submit" className="task_editor_submit_btn px-3 px-3 border rounded border-transparent text-sm font-medium leading-8 hover:bg-orange-700">
                    {props.SubmitString}
                </button>
            </div>
        </form>
    )
}
export default TaskEditor;
