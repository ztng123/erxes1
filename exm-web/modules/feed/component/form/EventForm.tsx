"use client"

import { useEffect, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { XCircle } from "lucide-react"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import { DatePicker } from "@/components/ui/date-picker"
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { FacetedFilter } from "@/components/ui/faceted-filter"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import LoadingPost from "@/components/ui/loadingPost"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { AttachmentWithPreview } from "@/components/AttachmentWithPreview"

import useFeedMutation from "../../hooks/useFeedMutation"
import { useTeamMembers } from "../../hooks/useTeamMembers"
import { IFeed } from "../../types"
import Uploader from "./uploader/Uploader"

const FormSchema = z.object({
  title: z
    .string({
      required_error: "Please enter an title",
    })
    .refine((val) => val.length !== 0, {
      message: "Please enter an title",
    }),
  description: z
    .string({
      required_error: "Please enter an description",
    })
    .refine((val) => val.length !== 0, {
      message: "Please enter an description",
    }),
  where: z
    .string({
      required_error: "Where must be chosen",
    })
    .refine((val) => val.length !== 0, {
      message: "Where must be chosen",
    }),
  startDate: z.date(),
  endDate: z.date(),
  departmentIds: z.array(z.string()).optional(),
  branchIds: z.array(z.string()).optional(),
  unitId: z.string().optional(),
})

const EventForm = ({
  feed,
  setOpen,
}: {
  feed?: IFeed
  setOpen: (open: boolean) => void
}) => {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  })

  const [images, setImage] = useState(feed?.images || [])
  const [attachments, setAttachments] = useState(feed?.attachments || [])

  const callBack = (result: string) => {
    if (result === "success") {
      setOpen(false)
      form.reset()
    }
  }

  const { feedMutation, loading: mutationLoading } = useFeedMutation({
    callBack,
  })
  const { branches, departments, unitsMain, loading } = useTeamMembers({})

  useEffect(() => {
    let defaultValues = {} as any
    let date = {} as any

    if (feed) {
      defaultValues = { ...feed }
      date = { ...feed.eventData }

      date.startDate = new Date(date.startDate)

      date.endDate = new Date(date.endDate)
    }

    form.reset({ ...defaultValues, ...date })
  }, [feed])

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    feedMutation(
      {
        title: data.title,
        description: data.description ? data.description : "",
        contentType: "event",
        departmentIds: data?.departmentIds || [],
        branchIds: data?.branchIds || [],
        unitId: data.unitId || "",
        eventData: {
          visibility: "public",
          where: data.where || "",
          startDate: data.startDate,
          endDate: data.endDate,
        },
      },
      feed?._id || ""
    )
  }

  const deleteAttachment = (index: number) => {
    const updated = [...attachments]

    updated.splice(index, 1)

    setAttachments(updated)
  }

  const deleteImage = (index: number) => {
    const updated = [...images]

    updated.splice(index, 1)

    setImage(updated)
  }

  return (
    <DialogContent className="max-h-[80vh] overflow-auto">
      <DialogHeader>
        <DialogTitle>Create event</DialogTitle>
      </DialogHeader>

      {mutationLoading ? <LoadingPost /> : null}

      <Form {...form}>
        <form className="space-y-3" onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="block">Start Date</FormLabel>
                <FormControl>
                  <DatePicker
                    date={field.value}
                    setDate={field.onChange}
                    className="w-full"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="endDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="block">End Date</FormLabel>
                <FormControl>
                  <DatePicker
                    date={field.value}
                    setDate={field.onChange}
                    className="w-full"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="title" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="description"
                    {...field}
                    defaultValue={feed?.description || ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="where"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Where</FormLabel>
                <FormControl>
                  <Textarea
                    className="rounded-md px-3 py-2"
                    placeholder="where"
                    {...field}
                    defaultValue={feed?.eventData?.where || ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="departmentIds"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Departments</FormLabel>
                <FormControl>
                  {loading ? (
                    <Input disabled={true} placeholder="Loading..." />
                  ) : (
                    <FacetedFilter
                      options={(departments || []).map((department: any) => ({
                        label: department.title,
                        value: department._id,
                      }))}
                      title="Departments"
                      values={field.value}
                      onSelect={field.onChange}
                    />
                  )}
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="branchIds"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Branches</FormLabel>
                <FormControl>
                  {loading ? (
                    <Input disabled={true} placeholder="Loading..." />
                  ) : (
                    <FacetedFilter
                      options={(branches || []).map((branch: any) => ({
                        label: branch.title,
                        value: branch._id,
                      }))}
                      title="Branches"
                      values={field.value}
                      onSelect={field.onChange}
                    />
                  )}
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="unitId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Unit</FormLabel>
                <FormControl>
                  {loading ? (
                    <Input disabled={true} placeholder="Loading..." />
                  ) : (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="">
                        <SelectValue placeholder="сонгох" />
                      </SelectTrigger>
                      <SelectContent>
                        {(unitsMain?.list || []).map((unit: any) => (
                          <SelectItem key={unit._id} value={unit._id}>
                            {unit.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Uploader
            defaultFileList={images || []}
            onChange={setImage}
            type={"image"}
          />
          {images && images.length > 0 && (
            <AttachmentWithPreview
              images={images}
              className="mt-2"
              deleteImage={deleteImage}
            />
          )}

          <Uploader
            defaultFileList={attachments || []}
            onChange={setAttachments}
          />

          {(attachments || []).map((attachment, index) => {
            return (
              <div
                key={index}
                className="flex items-center border-y text-sm font-semibold text-[#444] p-2.5"
              >
                {attachment.name}{" "}
                <XCircle size={18} onClick={() => deleteAttachment(index)} />
              </div>
            )
          })}

          <Button type="submit" className="font-semibold w-full rounded-full">
            Post
          </Button>
        </form>
      </Form>
    </DialogContent>
  )
}

export default EventForm
