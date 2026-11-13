import { useEffect } from "react";
import { useGetTaskHeader } from "../../common/fetchTasks";
import { Loader } from "../../components/mini/Loader";
import { useParams } from "react-router-dom";
import WebApp from "@twa-dev/sdk";
import { t } from "i18next";
import Participant from "./Participant";
import Priority from "./Priority";
import { Controller, useForm } from "react-hook-form";
import Square from "../../assets/icons/Square";
import { useCreateTask } from "../../data/hooks/tasks";
import Deadline from "./Deadline";
import { UserInterface } from "../../data/hooks/users/interface";

export interface IPriority {
  title: string;
}

interface FormValues {
  name: string;
  description: string;
  priority: number;
  participants: UserInterface[];
  storyPoint: number;
  deadline?: string;
}

const CreateTaskFromGroup = () => {
  useEffect(() => {
    WebApp.setHeaderColor("#F2F2F7");
  }, []);
  const createTaskMutate = useCreateTask();
  const { project_id } = useParams();

  const {
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<FormValues>({
    defaultValues: { priority: 2, name: "", description: "", participants: [] },
  });

  const onSubmit = async (data: FormValues) => {
    const taskData = {
      project_id: Number(project_id),
      name: data.name,
      description: data.description,
      priority: data.priority,
      participant: data.participants.map(
        (user: UserInterface) => user.telegram_id,
      ),
      point: 0,
      deadline: data.deadline,
      // point: Number(data.storyPoint),
    };

    createTaskMutate.mutate(taskData);
  };

  const {
    data: project,
    isLoading,
    error,
  } = useGetTaskHeader(Number(project_id));

  if (isLoading) return <Loader />;

  if (error instanceof Error) {
    return <div>An error occurred: {error.message}</div>;
  }
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="fixed top-0 left-0 right-0 flex justify-between h-[56px] items-center bg-[#f2f2f7] p-3">
        <div className="text-gray-500 h-full w-[60px] flex items-center"></div>
        <div>{t("new_task")}</div>
        <div className="text-gray-500 h-full w-[60px] flex items-center justify-end"></div>
      </div>
      <div className="h-[56px]"></div>
      <div className="p-3">
        <div className="bg-white shadow-customShadow rounded-xl p-3 pb-2">
          <div className="flex items-center gap-[8px]">
            <div className={"relative top-[-4px]"}>
              <Square />
            </div>
            <Controller
              control={control}
              name="name"
              rules={{ required: "Task name is required" }}
              render={({ field }) => (
                <input
                  type="text"
                  placeholder={t("name_of_task")}
                  {...field}
                  className="w-full outline-none font-sans mb-2"
                />
              )}
            />
          </div>
          {errors.name && (
            <p className="text-xs relative top-[-6px] h-3 text-red-500">
              {errors.name?.message}
            </p>
          )}
          <Controller
            control={control}
            name="description"
            render={({ field }) => (
              <textarea
                {...field}
                onChange={(e) => {
                  field.onChange(e);
                  const target = e.target as HTMLTextAreaElement;
                  target.style.height = "auto";
                  target.style.height = `${target.scrollHeight}px`;
                }}
                placeholder={t("task_description")}
                rows={1}
                style={{ overflow: "hidden", resize: "none" }}
                className="text-[14px] font-sans text-gray-500 w-full outline-none"
              />
            )}
          />
        </div>

        <div className="bg-white shadow-customShadow rounded-xl mt-5 cursor-pointer">
          <Controller
            control={control}
            name="participants"
            rules={{ required: "Participat is required" }}
            render={({ field }) => {
              return (
                <>
                  <Participant
                    setSelectedUsers={field.onChange}
                    selectedUsers={field.value}
                    project={project}
                    project_id={Number(project_id)}
                  />
                </>
              );
            }}
          />
          {errors.participants && (
            <p className="text-xs relative top-[-6px] left-4 h-3 text-red-500">
              {errors.participants?.message}
            </p>
          )}
          <Controller
            control={control}
            name="deadline"
            render={({ field }) => {
              return (
                <>
                  <Deadline
                    deadline={field.value as string}
                    setDeadline={field.onChange}
                  />
                </>
              );
            }}
          />
          <Controller
            control={control}
            name="priority"
            render={({ field }) => {
              return (
                <Priority
                  setSelectPriority={field.onChange}
                  selectPriority={field.value}
                />
              );
            }}
          />
          {/* Story Point */}
          {/* <Controller
            control={control}
            name='storyPoint'
            render={({ field }) => {
              return (
                <StoryPoint
                  storyPoint={field.value}
                  setStoryPoint={field.onChange}
                />
              );
            }}
          /> */}
        </div>
        <button
          type="submit"
          disabled={!!errors.name}
          className={`fixed bottom-[42px] w-[95%] max-w-[680px] left-1/2 -translate-x-1/2 py-4 rounded-xl flex justify-center items-center ${
            errors.name
              ? "bg-gray-300 text-gray-400"
              : "bg-custom-gradient-blue text-white"
          }`}
        >
          {" "}
          {t("create")}
        </button>
      </div>
    </form>
  );
};

export default CreateTaskFromGroup;
