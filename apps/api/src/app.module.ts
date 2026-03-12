import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { ClubsModule } from './modules/clubs/clubs.module';
import { TeamsModule } from './modules/teams/teams.module';
import { PlayersModule } from './modules/players/players.module';
import { CompetitionsModule } from './modules/competitions/competitions.module';
import { MatchesModule } from './modules/matches/matches.module';
import { StreamingModule } from './modules/streaming/streaming.module';
import { ScoreModule } from './modules/score/score.module';
import { ChatModule } from './modules/chat/chat.module';
import { ModerationModule } from './modules/moderation/moderation.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { AdminModule } from './modules/admin/admin.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env.local',
    }),
    AuthModule,
    UsersModule,
    ClubsModule,
    TeamsModule,
    PlayersModule,
    CompetitionsModule,
    MatchesModule,
    StreamingModule,
    ScoreModule,
    ChatModule,
    ModerationModule,
    NotificationsModule,
    AdminModule,
  ],
})
export class AppModule {}
