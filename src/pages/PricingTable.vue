<template>
  <APageHeader title="Выбор тарифа" />

  <ARow :gutter="[24, 24]">
    <ACol
      :lg="14"
      :xl="14"
      :xs="24"
      :xxl="18"
    >
      <ACard>
        <h2>Что дает доступ в ERP “TANBALAU”?</h2>

        <h3>Полная версия в ERP “Tanbalau” предоставляет доступ к функционалу:</h3>

        <ul class="list-disc pl-6 mb-6">
          <li>
            <span class="font-weight-bold">Интеграция с Национальным Каталогом Товаров (НКТ)</span>
            <ul class="list-disc pl-6">
              <li>
                Добавление группы товаров
              </li>
              <li>
                Дублирование атрибутов с редактированием нужных полей
              </li>
              <li>
                Массовая отправка товаров на модерацию
              </li>
              <li>
                Вывод комментариев с НКТ
              </li>
              <li>
                Подписание и публикация товаров через ЭЦП
              </li>
            </ul>
          </li>

          <li>
            <span class="font-weight-bold">Интеграция с Системой Управления Заказами (СУЗ)</span>
            <ul class="list-disc pl-6">
              <li>
                Комплексное создание заказов на формирование кодов маркировки
              </li>
              <li>
                Массовое создание печати кодов маркировок из разных заказов
              </li>
              <li>
                Выбор формата этикеток
              </li>
              <li>
                Повторная печать поврежденных этикеток
              </li>
            </ul>
          </li>

          <li>
            <span class="font-weight-bold">Статистика</span>
            <ul class="list-disc pl-6">
              <li>
                Общая статистика
              </li>
              <li>
                Статистика по НКТ
              </li>
              <li>
                Статистика по СУЗ
              </li>
            </ul>
          </li>
        </ul>

        <h4 class="font-weight-bold ">
          В системе представлено 2 вида тарифа:
        </h4>
        <ul class="list-disc pl-6 mb-6">
          <li>
            Доступ на 6 месяцев
          </li>
          <li>
            Доступ на 12 месяцев
          </li>
        </ul>

        <p>Для того, чтобы приобрести тариф необходимо Добавить свою организацию и подтвердить её с помощью ключа ЭЦП. Вы можете приобрести тариф неограниченное количество раз, при этом срок действия тарифа будет суммироваться.</p>

        <div class="mb-5">
          Больше информации можно найти в разделе
          <RouterLink :to="{name: 'FaqMain'}">
            Вопрос-Ответ
          </RouterLink>
        </div>

        <div>
          <h4>По всем остальным вопросам:</h4>
          <div>
            <a href="mailto:support@qlt.kz">support@qlt.kz</a>
          </div>
          <div>
            <a href="tel:+77476034600">+7 747 603 46 00</a>
          </div>
        </div>
      </ACard>
    </ACol>

    <ACol
      :md="10"
      :xs="24"
      :xxl="6"
    >
      <PaymentInfo />
    </ACol>
  </ARow>
</template>

<script setup lang="ts">
import PaymentInfo from '@/components/PaymentInfo.vue'; </script>
