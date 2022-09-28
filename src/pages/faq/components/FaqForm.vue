<template>
  <AForm
    id="faq_form"
    layout="vertical"
    :model="state.form"
    :rules="formRules"
    @finish="handleFinish"
  >
    <ARow :gutter="24">
      <ACol
        :lg="18"
        :md="18"
        :xs="24"
      >
        <AFormItem label="Вопрос" name="question">
          <ATextarea
            v-model:value="state.form.question"
            :rows="4"
            size="large"
          />
        </AFormItem>
      </ACol>
      <ACol
        :lg="18"
        :md="18"
        :xs="24"
      >
        <AFormItem
          label="Ответ"
          name="answer"
        >
          <QuillEditor
            ref="quillEditor"
            v-model:content="state.form.answer"
            content-type="html"
            :toolbar="[ [{ 'header': '2' }], ['bold', 'italic', 'underline'], [{'list': 'ordered'}], [{ 'list': 'bullet' }], ['clean']]"
          />
        </AFormItem>
      </ACol>
      <ACol
        :lg="10"
        :md="10"
        :sm="10"
        :xs="24"
      >
        <AFormItem label="Ссылка на видео" name="url">
          <AInput v-model:value="state.form.url" size="large" />
        </AFormItem>
      </ACol>
    </ARow>
  </AForm>
</template>

<script setup lang="ts">
import { QuillEditor } from '@vueup/vue-quill';
import { vvRequired } from '@/utils/form-validators';
import type { ValidationRules } from '@/types';
import type { IFaq } from '@/models/faq.models';
import { Faq } from '@/models/faq.models';
import { FaqService } from '@/services/faq.service';
import { Executor } from '@/network/executor';
import '@vueup/vue-quill/dist/vue-quill.snow.css';

interface Props {dataId?: string | number}

const props = withDefaults(defineProps<Props>(), {
  dataId: '',
});

const emit = defineEmits(['saved']);

const state = reactive({
  form: {
    question: '',
    answer: '',
    url: '',
  } as IFaq,
});

const isEditing = computed(() => !!props.dataId);
const quillEditor = ref<InstanceType<typeof QuillEditor>>();

const formRules = computed((): ValidationRules => {
  return {
    question: vvRequired,
    answer: vvRequired,
  };
});

function readFaq() {
  Executor.run<Faq>({
    request: FaqService.readPoll(props.dataId),
    globalLoading: true,
    onResult(data) {
      state.form = data;
      quillEditor.value?.setHTML(data.answer as string);
    },
  });
}

function handleFinish(values: IFaq) {
  const formModel = new Faq({
    question: values.question,
    answer: values.answer,
    url: values.url,
  });

  const request = isEditing.value
    ? FaqService.updatePoll(props.dataId, formModel)
    : FaqService.createPoll(formModel);

  Executor.run({
    request,
    globalLoading: true,
    onResult() {
      emit('saved');
    },
  });
}

if (isEditing.value)
  readFaq();

</script>
