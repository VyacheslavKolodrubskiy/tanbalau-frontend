<template>
  <div v-if="application">
    <APageHeader title="Просмотр “Заявки”" @back="() => $router.go(-1)">
      <template #tags>
        <StatusTag
          :variant="getApplicationStatusVariant(application.status.id)"
        >
          {{ application.status.title }}
        </StatusTag>
      </template>
      <template #extra>
        <QBtn
          v-if="showCloseApplication"
          danger
          size="large"
          type="primary"
          @click="closeApplication"
        >
          Закрыть заявку
        </QBtn>
      </template>
    </APageHeader>

    <ARow :gutter="[24, 24]">
      <ACol
        :lg="12"
        :xs="24"
        :xxl="16"
      >
        <ACard class="block-left mb-5">
          <h2 class="block-left__title">
            {{ application.title }}
          </h2>
          <p class="block-left__info">
            {{ application.description }}
          </p>
          <div
            v-if="application.files && application.files.length"
            class="block-left__files"
          >
            <ASpace direction="vertical">
              <QFileLink
                v-for="file in application.files"
                :key="file.id"
                :url="file.path"
              >
                {{ file.name }}
              </QFileLink>
            </ASpace>
          </div>
        </ACard>

        <template v-if="application.replies">
          <ACard
            v-for="reply in application.replies"
            :key="reply.id"
            class="block-left mb-5"
          >
            <h2 class="block-left__title">
              <span class="font-weight-semibold mr-1">
                {{ reply.author.name }}
              </span>
              <span class="text-gray-600 mr-1">
                ({{ reply.author.role.title }})
              </span>
              <span class="font-weight-semibold">
                {{ $format(reply.created_at, 'datetime') }}
              </span>
            </h2>
            <p class="block-left__info">
              {{ reply.text }}
            </p>
            <div
              v-if="reply.files && reply.files.length"
              class="block-left__files"
            >
              <ASpace direction="vertical">
                <QFileLink
                  v-for="file in reply.files"
                  :key="file.id"
                  :url="file.path"
                >
                  {{ file.name }}
                </QFileLink>
              </ASpace>
            </div>
          </ACard>
        </template>

        <ACard v-if="showForm">
          <AForm
            layout="vertical"
            :model="replyForm"
            :rules="replyFormRules"
            @finish="submitReply"
          >
            <AFormItem label="Ответ" name="text">
              <ATextarea v-model:value="replyForm.text" rows="4" />
            </AFormItem>

            <AFormItem label="Прикрепить файлы" name="files">
              <QUpload
                v-model:value="replyForm.files"
                accept-base
                multiple
              >
                <QBtn size="large">
                  <QIcon type="upload" />
                  Добавить
                </QBtn>
              </QUpload>
            </AFormItem>

            <AFormItem>
              <SubmitButton> Отправить </SubmitButton>
            </AFormItem>
          </AForm>
        </ACard>
      </ACol>
      <ACol
        :lg="12"
        :xs="24"
        :xxl="8"
      >
        <ACard class="block-info">
          <h2 class="block-info__title">
            Информация по заявке
          </h2>
          <div class="block-info__item">
            <h3 class="block-info__item-title">
              Номер заявки
            </h3>
            <div class="block-info__item-subtitle">
              {{ application.id }}
            </div>
          </div>
          <div class="block-info__item">
            <h3 class="block-info__item-title">
              Дата формирования заявки
            </h3>
            <div class="block-info__item-subtitle">
              {{ $format(application.created_at, 'datetime') }}
            </div>
          </div>
          <div class="block-info__item">
            <h3 class="block-info__item-title">
              Организация
            </h3>
            <div class="block-info__item-subtitle">
              <span>
                <RouterLink
                  :to="{
                    name: 'CatalogOrganizationsView',
                    params: { id: application.counterparty.id },
                  }"
                  type="link"
                >
                  {{ application.counterparty.title }}
                </RouterLink>
              </span>
              ({{ application.counterparty.email }} |
              {{ $format(application.counterparty.phone, 'phone') }})
            </div>
          </div>
          <div v-if="application.author" class="block-info__item">
            <h3 class="block-info__item-title">
              Автор заявки
            </h3>
            <div class="block-info__item-subtitle">
              {{ application.author.name }}
              ({{ application.author.email }} | {{ $format(application.author.phone, 'phone') }})
            </div>
          </div>
          <div v-if="application.manager">
            <div class="block-info__item">
              <h3 class="block-info__item-title">
                Ответственный менеджер
              </h3>
              <div class="block-info__item-subtitle">
                {{ application.manager.name }}
              </div>
            </div>
          </div>
        </ACard>
      </ACol>
    </ARow>
  </div>
</template>

<script>
import { getApplicationStatusVariant } from '@/utils/utils';
import { getAxios, postAxios } from '@/services/http/request';
import { APPLICATION_STATUSES } from '@/config/types';
import { vvRequired } from '@/utils/form-validators';

export default {
  name: 'ApplicationView',
  data() {
    return {
      replyForm: {
        text: '',
        files: [],
      },
      replyFormRules: {
        text: vvRequired,
      },
      formSetManager: {
        manager_id: '',
      },
      formSetManagerRules: {
        manager_id: vvRequired,
      },

      application: null,
    };
  },
  computed: {
    showForm() {
      if (this.application.status.id === APPLICATION_STATUSES.closed.id)
        return false;
      if (this.$canUse(['client']))
        return this.application.status.id === APPLICATION_STATUSES.responded.id;

      return false;
    },

    showCloseApplication() {
      return (
        this.$canUse(['client'])
        && this.application?.status.id !== APPLICATION_STATUSES.closed.id
      );
    },
  },
  created() {
    this.readApplication();
  },
  methods: {
    getApplicationStatusVariant,

    readApplication() {
      getAxios(`/application/${this.$route.params.id}`).then((res) => {
        this.application = res.data;
      });
    },

    closeApplication() {
      this.$confirm({
        title: 'Вы уверены что хотите закрыть заявку?',
        okText: 'Да',
        okType: 'danger',
        cancelText: 'Нет',
        onOk: () => {
          getAxios(`/application/close/${this.application.id}`).then(() => {
            this.readApplication();
            this.$notification.success({
              message: 'Заявка закрыта',
            });
          });
        },
      });
    },

    submitReply(values) {
      postAxios(`/application/reply/${this.application.id}`, values, { formDataConvert: true }).then(() => {
        this.$notification.success({
          message: 'Сохранено',
        });
        this.readApplication();
      });
    },
  },
};
</script>

<style scoped lang="scss">
.block-left {
  &__title {
    font-weight: normal;
    font-size: 16px;
    line-height: 24px;
    color: #4f4f4f;
    margin: 0;
  }
  &__info {
    max-width: 843px;
    margin: 21px 0px 0px 0px;
    font-weight: normal;
    font-size: 14px;
    line-height: 22px;
    color: #262626;
  }
  &__files {
    margin-top: 27px;
  }
  &__file {
    &:not(:last-child) {
      margin-bottom: 10px;
    }
  }
}
.block-info {
  &__title {
    font-weight: normal;
    font-size: 24px;
    line-height: 29px;
    color: #323136;
    margin-bottom: 32px;
  }
  &__item {
    margin-bottom: 25px;
  }
  &__item-title {
    font-weight: 600;
    font-size: 16px;
    line-height: 22px;
    color: #262626;
  }
  &__item-subtitle {
    font-weight: normal;
    font-size: 16px;
    line-height: 24px;
    color: #4f4f4f;
    span {
      color: #2d9cdb;
    }
  }
}
</style>
